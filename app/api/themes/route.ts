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

    // Cache themes for a short while at the CDN to speed up pages that list themes
    const res = NextResponse.json({ themes });
    res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res;
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
