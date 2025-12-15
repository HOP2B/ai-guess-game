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

    // Get unguessed characters for the AI to choose from
    const unguessedGameCharacters = game.gameCharacters.filter(gc => !gc.guessed);
    const unguessedCharacterNames = unguessedGameCharacters.map(gc => gc.character.name).join(', ');

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

    // Use DeepSeek to guess the character based on the hint
    const prompt = `You are playing a character guessing game. The possible characters are: ${unguessedCharacterNames}.

The player is giving you a hint about a character they have in mind. Based on this hint: "${hint}"

Guess which character it is. Respond with only the character name, nothing else. If you're not sure, make your best guess.`;

    const chatResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const guess = chatResponse.choices[0]?.message?.content?.trim();

    // Find the guessed character
    const guessedGameCharacter = unguessedGameCharacters.find(gc => {
      const normalizedGuess = guess?.toLowerCase().trim();
      const normalizedName = gc.character.name.toLowerCase().trim();
      return normalizedGuess === normalizedName ||
             (normalizedGuess && normalizedGuess.includes(normalizedName)) ||
             (normalizedGuess && normalizedName.includes(normalizedGuess));
    });

    const isCorrect = !!guessedGameCharacter;

    if (isCorrect) {
      // Mark the character as guessed
      await prisma.gameCharacter.update({
        where: { id: guessedGameCharacter!.id },
        data: { guessed: true },
      });

      // Check if all characters are guessed
      const unguessedCount = await prisma.gameCharacter.count({
        where: { gameId, guessed: false },
      });

      if (unguessedCount === 0) {
        // Calculate total points
        const totalPoints = game.theme.characters.reduce((sum, c) => sum + c.points, 0);

        // Update game status to completed and add points to user
        await prisma.$transaction([
          prisma.game.update({
            where: { id: gameId },
            data: { status: 'completed' },
          }),
          prisma.user.update({
            where: { id: game.userId },
            data: { score: { increment: totalPoints } },
          }),
        ]);
      }
    }

    return NextResponse.json({
      guess,
      isCorrect,
      correctCharacter: isCorrect ? guessedGameCharacter!.character.name : undefined,
      gameCompleted: isCorrect && game.gameCharacters.every(gc => gc.guessed || gc.id === guessedGameCharacter!.id),
    });
  } catch (error) {
    console.error('Error in give-hint:', error);
    return NextResponse.json({ error: 'Failed to process hint' }, { status: 500 });
  }
}