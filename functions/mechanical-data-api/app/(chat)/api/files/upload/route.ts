import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'File type should be JPEG or PNG',
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validation = FileSchema.safeParse({ file });
    if (!validation.success) {
      const errorMessage = validation.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get file name if it's a File instance
    const fileName = (formData.get('file') as File)?.name ?? `upload-${Date.now()}`;
    const buffer = await file.arrayBuffer();

    const blob = await put(fileName, buffer, { access: 'public' });

    return NextResponse.json(blob);
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
