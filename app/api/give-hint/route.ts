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

    // Balanced AI prompt for character guessing
    const prompt = `You are playing a character guessing game.

Possible characters: ${allCharacterNames}

Player hint: "${hint}"

Instructions:
- Choose the character that BEST matches the hint
- Consider all characters in the database
- Make your best guess based on the hint
- Be logical but don't overthink it

Respond with ONLY the character name, nothing else.`;

    const chatResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1, // Very focused responses
      max_tokens: 50, // Short responses only
      top_p: 0.5, // More deterministic
    });

    let guess = chatResponse.choices[0]?.message?.content?.trim();

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

    // If AI guessed a non-existent character, pick a random character
    if (!guessedCharacter) {
      if (allCharactersFull.length > 0) {
        guessedCharacter = allCharactersFull[Math.floor(Math.random() * allCharactersFull.length)];
        guess = guessedCharacter.name; // Override the AI's invalid guess
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