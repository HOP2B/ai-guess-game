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

    // Get a random character
    const characters = await prisma.character.findMany();
    if (characters.length === 0) {
      return NextResponse.json({ error: 'No characters available' }, { status: 400 });
    }
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    // Create a new game
    const game = await prisma.game.create({
      data: {
        userId: user.id,
        characterId: randomCharacter.id,
        status: 'active',
      },
      include: {
        character: true,
        user: true,
      },
    });

    return NextResponse.json({ game });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}