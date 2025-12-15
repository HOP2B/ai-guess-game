import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { username: username.trim() },
      update: {},
      create: { username: username.trim() },
    });

    // Get a random theme
    const themes = await prisma.theme.findMany({
      include: { characters: true },
    });
    if (themes.length === 0) {
      return NextResponse.json({ error: 'No themes available' }, { status: 400 });
    }
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    // Create a new game
    const game = await prisma.game.create({
      data: {
        userId: user.id,
        themeId: randomTheme.id,
        status: 'active',
      },
    });

    // Create GameCharacter entries for all characters in the theme
    const gameCharactersData = randomTheme.characters.map(character => ({
      gameId: game.id,
      characterId: character.id,
    }));
    await prisma.gameCharacter.createMany({
      data: gameCharactersData,
    });

    // Fetch the game with includes
    const fullGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: {
        theme: true,
        user: true,
        gameCharacters: {
          include: { character: true },
        },
      },
    });

    return NextResponse.json({ game: fullGame });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}