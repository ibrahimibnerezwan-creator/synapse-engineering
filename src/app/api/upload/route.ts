import { NextRequest, NextResponse } from 'next/server';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { MAX_UPLOAD_BYTES } from '@/lib/productMedia';

const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export async function POST(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const file = (await req.formData()).get('file');
    if (!(file instanceof File) || !extensions[file.type] || file.size === 0) return NextResponse.json({ error: 'Choose a JPEG, PNG, WebP or GIF photo.' }, { status: 400 });
    if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'This photo is too large. Select it through the product form to resize it automatically.' }, { status: 413 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const signature = file.type === 'image/jpeg' ? buffer[0] === 0xff && buffer[1] === 0xd8
      : file.type === 'image/png' ? buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      : file.type === 'image/webp' ? buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP'
      : /^GIF8[79]a/.test(buffer.subarray(0, 6).toString());
    if (!signature) return NextResponse.json({ error: 'That file is not a readable product photo.' }, { status: 400 });
    const key = 'products/' + crypto.randomUUID() + '.' + extensions[file.type];
    const configured = process.env.CF_ACCESS_KEY_ID || process.env.CF_SECRET_ACCESS_KEY;
    if (configured) {
      const publicBase = process.env.CF_R2_PUBLIC_URL?.replace(/\/+$/, '');
      if (!process.env.CF_ACCOUNT_ID || !process.env.CF_ACCESS_KEY_ID || !process.env.CF_SECRET_ACCESS_KEY || !publicBase?.startsWith('https://')) return NextResponse.json({ error: 'Photo storage is incomplete. Configure the R2 credentials and public bucket URL before uploading.' }, { status: 503 });
      await r2Client.send(new PutObjectCommand({ Bucket: process.env.CF_BUCKET_NAME || 'synapse-assets', Key: key, Body: buffer, ContentType: file.type }));
      return NextResponse.json({ success: true, url: publicBase + '/' + key });
    }
    return NextResponse.json({ success: true, url: 'data:' + file.type + ';base64,' + buffer.toString('base64') });
  } catch { return NextResponse.json({ error: 'The photo could not be uploaded. Please try again.' }, { status: 503 }); }
}
