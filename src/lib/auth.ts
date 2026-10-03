import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('Admin session configuration is incomplete.');
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: { role: string; email?: string } = { role: 'admin' }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('synapse_admin_token')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.role === 'admin';
}
