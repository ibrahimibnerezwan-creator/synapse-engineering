import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { generateAI } from '@/lib/gemini';
import type { Part } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { text, imageBase64, mimeType = 'image/jpeg' } = body || {};
  if ((!text && !imageBase64) || (text && (typeof text !== 'string' || text.length > 10000)) || (imageBase64 && (typeof imageBase64 !== 'string' || imageBase64.length > 1_000_000 || !/^image\/(?:jpeg|png|webp)$/.test(mimeType)))) return NextResponse.json({ error: 'Provide a customer message or a readable, resized screenshot.' }, { status: 400 });
  const prompt = 'Extract order details from this Bangladeshi customer message or screenshot. Return JSON with name, phone, address, productHint, amountHint (unit price), deliveryZone (dhaka/suburb/outside), paymentMethod (cod/bkash/nagad). Leave unknown text blank; do not invent missing details. Only return valid JSON.';
  const parts: Part[] = [{ text: prompt }];
  if (text) parts.push({ text });
  if (imageBase64) parts.push({ inlineData: { data: imageBase64, mimeType } });
  try {
    const data = JSON.parse(await generateAI(parts, true));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('The AI could not read the order details. Enter them manually.');
    return NextResponse.json(data);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'The AI could not read the order. Try again or fill in the form.' }, { status: 503 }); }
}
