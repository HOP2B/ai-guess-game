import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const themeId = parseInt(params.id);

    // Delete theme (cascade will delete characters and forbidden words)
    await prisma.theme.delete({
      where: { id: themeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
  }
}