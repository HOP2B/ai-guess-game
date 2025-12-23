import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { characterId: string; word: string } }) {
  try {
    const characterId = parseInt(params.characterId);
    const word = decodeURIComponent(params.word);

    // Delete forbidden word
    await prisma.forbiddenWord.deleteMany({
      where: {
        characterId: characterId,
        word: word.toLowerCase(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete forbidden word' }, { status: 500 });
  }
}