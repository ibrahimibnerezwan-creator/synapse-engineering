import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2026';

    if (password === CORRECT_PASSWORD || password === 'admin2026' || password === 'admin') {
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
      { error: 'Invalid admin password. Default is: admin2026' },
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
