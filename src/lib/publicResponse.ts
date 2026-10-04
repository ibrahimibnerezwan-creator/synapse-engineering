import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

/** Reuse public response bytes only after checking the current database content. */
export function publicResponse(request: Request, body: string | Buffer<ArrayBuffer>, contentType: string) {
  const digest = createHash('sha256').update(contentType).update('\0').update(body).digest('hex');
  // Weak validation remains correct if the host compresses the representation.
  const etag = `W/"${digest}"`;
  const matches = request.headers.get('if-none-match')?.split(',').some(value => {
    const tag = value.trim();
    return tag === '*' || tag.replace(/^W\//, '') === etag.slice(2);
  });
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': 'public, no-cache, must-revalidate',
    // Catalogue changes must be checked at the origin, including same-URL photo replacements.
    'Vercel-CDN-Cache-Control': 'no-store',
    'ETag': etag,
    'X-Content-Type-Options': 'nosniff',
  };
  return new NextResponse(matches ? null : body, { status: matches ? 304 : 200, headers });
}
