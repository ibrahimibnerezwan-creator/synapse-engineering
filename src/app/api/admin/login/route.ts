import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'node:crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const correctPassword = process.env.ADMIN_PASSWORD;
    if (!correctPassword || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return NextResponse.json({ error: 'Seller login is not configured. Contact the site owner.' }, { status: 503 });
    }

    if (typeof password === 'string' && timingSafeEqual(createHash('sha256').update(password).digest(), createHash('sha256').update(correctPassword).digest())) {
      const token = await signToken({ role: 'admin' });
      
      const cookieStore = await cookies();
      cookieStore.set('synapse_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid admin password.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('synapse_admin_token');
  return NextResponse.json({ success: true });
}
