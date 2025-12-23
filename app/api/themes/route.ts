import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    return NextResponse.json({ themes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, imageUrl } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Theme name is required' }, { status: 400 });
    }

    const theme = await prisma.theme.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ theme });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
  }
}

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