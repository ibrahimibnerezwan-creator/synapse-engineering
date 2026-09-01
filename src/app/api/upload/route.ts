import { NextRequest, NextResponse } from 'next/server';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop() || 'png';
    const key = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const BUCKET_NAME = process.env.CF_BUCKET_NAME || 'synapse-assets';
    const ACCESS_KEY = process.env.CF_ACCESS_KEY_ID;

    if (ACCESS_KEY) {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );
      const publicUrl = process.env.CF_R2_PUBLIC_URL
        ? `${process.env.CF_R2_PUBLIC_URL}/${key}`
        : `https://pub-${process.env.CF_ACCOUNT_ID}.r2.dev/${key}`;

      return NextResponse.json({ success: true, url: publicUrl, key });
    }

    // Fallback if R2 credentials not yet configured
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    return NextResponse.json({ success: true, url: base64, key });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
