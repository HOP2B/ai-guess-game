import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { gameId, hint } = await request.json();

    if (!gameId || !hint) {
      return NextResponse.json({ error: 'gameId and hint are required' }, { status: 400 });
    }

    // Get the game with theme and gameCharacters
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        theme: {
          include: { characters: true },
        },
        user: true,
        gameCharacters: {
          include: { character: true },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'active') {
      return NextResponse.json({ error: 'Game is not active' }, { status: 400 });
    }

    // Find the target character (the one in the game)
    const targetGameCharacter = game.gameCharacters.find(gc => !gc.guessed);
    if (!targetGameCharacter) {
      return NextResponse.json({ error: 'No target character found' }, { status: 400 });
    }

    // Get all characters in the database for the AI to choose from
    // But prioritize characters within the same theme for a narrower, more accurate prompt
    const themeCharacterNames = game.theme.characters.map(c => c.name).join(', ');
    const allCharacters = await prisma.character.findMany({
      select: { name: true },
    });
    const allCharacterNames = allCharacters.map(c => c.name).join(', ');

    // Check forbidden words for all characters in the theme
    const forbiddenWords = await prisma.forbiddenWord.findMany({
      where: { characterId: { in: game.theme.characters.map(c => c.id) } },
      select: { word: true },
    });

    if (forbiddenWords.length > 0) {
      const forbiddenWordSet = new Set(forbiddenWords.map((fw: { word: string }) => fw.word.toLowerCase()));

      // Check if hint contains any forbidden words
      const hintLower = hint.toLowerCase();
      const containsForbiddenWord = Array.from(forbiddenWordSet).some(forbiddenWord =>
        hintLower.includes(forbiddenWord)
      );

      if (containsForbiddenWord) {
        return NextResponse.json({
          error: 'Hint contains forbidden words'
        }, { status: 400 });
      }
    }

  // Improved prompt: narrow to theme characters, add a short few-shot example to guide format
  const prompt = `You are playing a character guessing game.

Priority characters (most likely): ${themeCharacterNames}
All possible characters: ${allCharacterNames}

Player hint: "${hint}"

Examples:
- Hint: "Tall wizard with long beard" -> Gandalf
- Hint: "Fast red hedgehog" -> Sonic

Instructions:
- Choose the character that BEST matches the hint.
- Prefer characters from the Priority list when appropriate.
- Return only the exact character name as it appears in the character list.
`;

    const chatResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1, // Very focused responses
      max_tokens: 50, // Short responses only
      top_p: 0.5, // More deterministic
    });

    let rawGuess = chatResponse.choices[0]?.message?.content?.trim() || '';

    // Sanitize the model output: remove quotes, extraneous punctuation, and trim
    const sanitize = (s: string) => s.replace(/^"|"$/g, '').replace(/[\n\r]/g, ' ').trim();
    let guess = sanitize(rawGuess);

    if (!guess) {
      return NextResponse.json({ error: 'AI response failed' }, { status: 500 });
    }

    // Check if the guess is correct
    const normalizedGuess = guess?.toLowerCase().trim();
    const normalizedTargetName = targetGameCharacter.character.name.toLowerCase().trim();
    const isCorrect = normalizedGuess === normalizedTargetName ||
                      (normalizedGuess && normalizedGuess.includes(normalizedTargetName)) ||
                      (normalizedGuess && normalizedTargetName.includes(normalizedGuess));

    // Find the guessed character from all characters in database
    const allCharactersFull = await prisma.character.findMany();
    let guessedCharacter = allCharactersFull.find(c =>
      c.name.toLowerCase().trim() === normalizedGuess ||
      (normalizedGuess && normalizedGuess.includes(c.name.toLowerCase().trim())) ||
      (normalizedGuess && c.name.toLowerCase().trim().includes(normalizedGuess))
    );

    // Fallback: fuzzy match by token overlap and shortest Levenshtein distance
    if (!guessedCharacter) {
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
      const guessTokens = new Set((normalize(guess) || '').split(/\s+/).filter(Boolean));

      let best: { char?: typeof allCharactersFull[0]; score: number; dist: number } = { score: 0, dist: Infinity };

      const levenshtein = (a: string, b: string) => {
        const al = a.length, bl = b.length;
        const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
        for (let i = 0; i <= al; i++) dp[i][0] = i;
        for (let j = 0; j <= bl; j++) dp[0][j] = j;
        for (let i = 1; i <= al; i++) {
          for (let j = 1; j <= bl; j++) {
            dp[i][j] = Math.min(
              dp[i - 1][j] + 1,
              dp[i][j - 1] + 1,
              dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
          }
        }
        return dp[al][bl];
      };

      for (const c of allCharactersFull) {
        const n = normalize(c.name);
        const tokens = new Set(n.split(/\s+/).filter(Boolean));
        const overlap = Array.from(tokens).filter(t => guessTokens.has(t)).length;
        const dist = levenshtein(n, normalize(guess));
        // prefer higher token overlap, then lower distance
        const score = overlap * 100 - dist;
        if (score > best.score || (score === best.score && dist < best.dist)) {
          best = { char: c, score, dist };
        }
      }

      if (best.char) {
        guessedCharacter = best.char;
        guess = guessedCharacter.name;
      } else if (allCharactersFull.length > 0) {
        // final fallback: pick a random character
        guessedCharacter = allCharactersFull[Math.floor(Math.random() * allCharactersFull.length)];
        guess = guessedCharacter.name;
      }
    }

    // Only update game state if AI actually made a guess (not "needs more hints")
    if (isCorrect) {
      // Mark the character as guessed
      await prisma.gameCharacter.update({
        where: { id: targetGameCharacter.id },
        data: { guessed: true },
      });

      // Award the user the points for this character (avoid awarding the whole theme total)
      const pointsForCharacter = targetGameCharacter.character.points || 0;
      await prisma.user.update({
        where: { id: game.userId },
        data: { score: { increment: pointsForCharacter } },
      });

      // Check if all characters are guessed and mark the game completed if so
      const unguessedCount = await prisma.gameCharacter.count({
        where: { gameId, guessed: false },
      });

      if (unguessedCount === 0) {
        await prisma.game.update({
          where: { id: gameId },
          data: { status: 'completed' },
        });
      }
    }

    return NextResponse.json({
      guess,
      isCorrect,
      correctCharacter: targetGameCharacter.character.name,
      correctCharacterImage: targetGameCharacter.character.imageUrl,
      guessedCharacterImage: guessedCharacter?.imageUrl,
      gameCompleted: isCorrect && await prisma.gameCharacter.count({ where: { gameId, guessed: false } }) === 0,
    });
  } catch (error) {
    console.error('Error in give-hint:', error);
    return NextResponse.json({ error: 'Failed to process hint' }, { status: 500 });
  }
}