import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const themeId = searchParams.get('themeId');

  if (!themeId) {
    return NextResponse.json({ error: 'themeId is required' }, { status: 400 });
  }

  try {
    const characters = await prisma.character.findMany({
      where: { themeId: parseInt(themeId) },
      include: { forbiddenWords: true },
    });

    if (characters.length === 0) {
      return NextResponse.json({ error: 'No characters found for this theme' }, { status: 404 });
    }

    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    return NextResponse.json({ character: randomCharacter });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch character' }, { status: 500 });
  }
}