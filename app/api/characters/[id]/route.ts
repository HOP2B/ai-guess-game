import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid character ID' }, { status: 400 });
    }

    const characterId = parseInt(id);

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
