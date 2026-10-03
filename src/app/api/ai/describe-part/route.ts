import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { generateAI } from '@/lib/gemini';

const PROMPT = `You are an industrial automation and engineering component catalog specialist.
Read only visible information in this product / nameplate photo. Do not invent specs, certifications, warranty or authenticity claims. Leave uncertain fields empty. Return a JSON object with:
- title: Clean professional product title in English (e.g. "Siemens S7-1500 4-Channel Analog Output Module")
- titleBn: Professional product title in Bengali (e.g. "সিমেন্স এস৭-১৫০০ অ্যানালগ আউটপুট মডিউল")
- brand: Manufacturer Brand (e.g. "Siemens", "HiTHIUM", "Schneider Electric", "Omron", "Delta", "Deye")
- modelNo: Exact model/part number extracted from tag (e.g. "6ES7532-5HD00-0AB0")
- category: Select one: "Industrial Automation", "Solar & Power Solutions", "Consumer Tech & Gadgets", "Global Sourcing & Import"
- descriptionEn: 2-3 sentences technical description mentioning voltage, capacity, application, and compliance.
- descriptionBn: 2-3 sentences professional Bengali description.
- specs: Key technical specs as a key-value object (e.g. { "Voltage": "230V", "Channels": "4", "Resolution": "16-bit" })

Respond ONLY with valid JSON. No markdown backticks.`;

export async function POST(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { imageBase64, mimeType } = body || {};
  if (typeof imageBase64 !== 'string' || !imageBase64 || imageBase64.length > 1_000_000 || !/^image\/(?:jpeg|png|webp)$/.test(mimeType || '')) return NextResponse.json({ error: 'Choose a readable, resized product photo.' }, { status: 400 });
  try {
    const data = JSON.parse(await generateAI([{ text: PROMPT }, { inlineData: { data: imageBase64, mimeType } }], true));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('The photo could not be read. Enter the details manually.');
    return NextResponse.json({ success: true, data });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'The photo could not be read. Try again or enter details manually.' }, { status: 503 }); }
}
