import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let file: File | null = null;
    let name: string = '';

    let themeName: string = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      file = formData.get('image') as File;
      name = formData.get('name') as string;
      themeName = formData.get('theme') as string;
    } else if (contentType.includes('application/json')) {
      const json = await request.json();
      name = json.name;
      themeName = json.theme;
      const imageData = json.image || json.imageUrl || json.image_url;

      if (!imageData) {
        return NextResponse.json({ error: 'Image data is required (use "image", "imageUrl", or "image_url" field)' }, { status: 400 });
      }

      if (imageData.startsWith('data:')) {
        // Handle base64 data URL
        const [mimePart, base64Data] = imageData.split(',');
        const mimeType = mimePart.split(':')[1].split(';')[0];
        const binaryData = atob(base64Data);
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        file = new File([bytes], `character-${Date.now()}.${mimeType.split('/')[1]}`, { type: mimeType });
      } else if (imageData.startsWith('http')) {
        // Handle image URL - fetch and convert to file
        try {
          const response = await fetch(imageData);
          if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch image from URL' }, { status: 400 });
          }
          const blob = await response.blob();
          const mimeType = blob.type || 'image/png';
          file = new File([blob], `character-${Date.now()}.${mimeType.split('/')[1]}`, { type: mimeType });
        } catch (error) {
          return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
        }
      } else {
        // Assume raw base64 string, treat as PNG
        try {
          const binaryData = atob(imageData);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          file = new File([bytes], `character-${Date.now()}.png`, { type: 'image/png' });
        } catch (error) {
          return NextResponse.json({ error: 'Invalid base64 image data' }, { status: 400 });
        }
      }
    } else {
      return NextResponse.json({ error: 'Unsupported content type. Use multipart/form-data or application/json with base64 image.' }, { status: 400 });
    }

    if (!file || !name || !themeName) {
      return NextResponse.json({ error: 'Image, name, and theme are required' }, { status: 400 });
    }

    const blob = await put(`characters/${file.name}`, file, {
      access: 'public',
    });

    // Find or create theme
    const theme = await prisma.theme.upsert({
      where: { name: themeName },
      update: {},
      create: { name: themeName },
    });

    const character = await prisma.character.create({
      data: {
        name,
        imageUrl: blob.url,
        themeId: theme.id,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload character' }, { status: 500 });
  }
}