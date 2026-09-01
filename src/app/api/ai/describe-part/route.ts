import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isAuthenticatedAdmin } from '@/lib/auth';

const PROMPT = `You are an industrial automation and engineering component catalog specialist.
Analyze this component / machine nameplate photo and return a JSON object with:
- title: Clean professional product title in English (e.g. "Siemens S7-1500 4-Channel Analog Output Module")
- titleBn: Professional product title in Bengali (e.g. "সিমেন্স এস৭-১৫০০ অ্যানালগ আউটপুট মডিউল")
- brand: Manufacturer Brand (e.g. "Siemens", "HiTHIUM", "Schneider Electric", "Omron", "Delta", "Deye")
- modelNo: Exact model/part number extracted from tag (e.g. "6ES7532-5HD00-0AB0")
- category: Select one: "Industrial Automation", "Solar & Power Solutions", "Global Sourcing & Import"
- descriptionEn: 2-3 sentences technical description mentioning voltage, capacity, application, and compliance.
- descriptionBn: 2-3 sentences professional Bengali description.
- specs: Key technical specs as a key-value object (e.g. { "Voltage": "230V", "Channels": "4", "Resolution": "16-bit" })

Respond ONLY with valid JSON. No markdown backticks.`;

export async function POST(req: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent([
      { text: PROMPT },
      { inlineData: { mimeType, data: imageBase64 } },
    ]);

    const parsed = JSON.parse(result.response.text());
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI parsing error' }, { status: 500 });
  }
}
