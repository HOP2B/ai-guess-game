import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { characterId, word } = await request.json();

    if (!characterId || !word || typeof word !== 'string' || word.trim() === '') {
      return NextResponse.json({ error: 'Character ID and word are required' }, { status: 400 });
    }

    const forbiddenWord = await prisma.forbiddenWord.create({
      data: {
        characterId: parseInt(characterId),
        word: word.trim().toLowerCase(),
      },
    });

    return NextResponse.json({ forbiddenWord });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add forbidden word' }, { status: 500 });
  }
}