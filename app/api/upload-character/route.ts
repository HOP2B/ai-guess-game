import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return NextResponse.json({ error: 'Image and name are required' }, { status: 400 });
    }

    const blob = await put(`characters/${file.name}`, file, {
      access: 'public',
    });

    const character = await prisma.character.create({
      data: {
        name,
        imageUrl: blob.url,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload character' }, { status: 500 });
  }
}