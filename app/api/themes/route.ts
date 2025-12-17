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