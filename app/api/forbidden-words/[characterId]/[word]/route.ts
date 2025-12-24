import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ characterId: string; word: string }> }) {
  try {
    const { characterId, word } = await params;
    const charId = parseInt(characterId);
    const decodedWord = decodeURIComponent(word);

    // Delete forbidden word
    await prisma.forbiddenWord.deleteMany({
      where: {
        characterId: charId,
        word: decodedWord.toLowerCase(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete forbidden word' }, { status: 500 });
  }
}