import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const characterId = parseInt(params.id);

    // Delete character (cascade will delete forbidden words and game characters)
    await prisma.character.delete({
      where: { id: characterId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete character' }, { status: 500 });
  }
}