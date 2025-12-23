import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const characters = await prisma.character.findMany({
      include: {
        forbiddenWords: {
          select: { word: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}