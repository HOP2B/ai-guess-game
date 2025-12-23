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

    // Get all characters in the theme for the AI to choose from
    const allThemeCharacters = game.theme.characters;
    const allCharacterNames = allThemeCharacters.map(c => c.name).join(', ');

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
    const prompt = `You are playing a character guessing game. The possible characters are: ${allCharacterNames}.

The player is giving you a hint about a character they have in mind. Based on this hint: "${hint}"

Guess which character it is. Respond with only the character name, nothing else. If you're not sure, make your best guess.`;

    const chatResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const guess = chatResponse.choices[0]?.message?.content?.trim();

    // Find the target character (the one in the game)
    const targetGameCharacter = game.gameCharacters.find(gc => !gc.guessed);
    if (!targetGameCharacter) {
      return NextResponse.json({ error: 'No target character found' }, { status: 400 });
    }

    // Check if the guess is correct
    const normalizedGuess = guess?.toLowerCase().trim();
    const normalizedTargetName = targetGameCharacter.character.name.toLowerCase().trim();
    const isCorrect = normalizedGuess === normalizedTargetName ||
                      (normalizedGuess && normalizedGuess.includes(normalizedTargetName)) ||
                      (normalizedGuess && normalizedTargetName.includes(normalizedGuess));

    // Find the guessed character (if it exists in the theme)
    const guessedCharacter = game.theme.characters.find(c =>
      c.name.toLowerCase().trim() === normalizedGuess ||
      (normalizedGuess && normalizedGuess.includes(c.name.toLowerCase().trim())) ||
      (normalizedGuess && c.name.toLowerCase().trim().includes(normalizedGuess))
    );

    // Mark the character as guessed (even if wrong, the attempt was made)
    await prisma.gameCharacter.update({
      where: { id: targetGameCharacter.id },
      data: { guessed: true },
    });

    // Complete the game
    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'completed' },
    });

    // Add points only if correct
    if (isCorrect) {
      const points = targetGameCharacter.character.points;
      await prisma.user.update({
        where: { id: game.userId },
        data: { score: { increment: points } },
      });
    }

    return NextResponse.json({
      guess,
      isCorrect,
      correctCharacter: isCorrect ? targetGameCharacter.character.name : undefined,
      guessedCharacterImage: guessedCharacter?.imageUrl,
    });
  } catch (error) {
    console.error('Error in give-hint:', error);
    return NextResponse.json({ error: 'Failed to process hint' }, { status: 500 });
  }
}