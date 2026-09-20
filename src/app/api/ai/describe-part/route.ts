import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isAuthenticatedAdmin } from '@/lib/auth';

const PROMPT = `You are an industrial automation and engineering component catalog specialist.
Analyze this component / machine nameplate photo and return a JSON object with:
- title: Clean professional product title in English (e.g. "Siemens S7-1500 4-Channel Analog Output Module")
- titleBn: Professional product title in Bengali (e.g. "সিমেন্স এস৭-১৫০০ অ্যানালগ আউটপুট মডিউল")
- brand: Manufacturer Brand (e.g. "Siemens", "HiTHIUM", "Schneider Electric", "Omron", "Delta", "Deye")
- modelNo: Exact model/part number extracted from tag (e.g. "6ES7532-5HD00-0AB0")
- category: Select one: "Industrial Automation", "Solar & Power Solutions", "Consumer Tech & Gadgets", "Global Sourcing & Import"
- descriptionEn: 2-3 sentences technical description mentioning voltage, capacity, application, and compliance.
- descriptionBn: 2-3 sentences professional Bengali description.
- specs: Key technical specs as a key-value object (e.g. { "Voltage": "230V", "Channels": "4", "Resolution": "16-bit" })

Respond ONLY with valid JSON. No markdown backticks.`;

// Gemini Flash models go 503 under load and get retired without warning, so the route
// walks a chain instead of trusting one name. Override in an emergency with AI_MODEL_CHAIN.
const MODEL_CHAIN =
  process.env.AI_MODEL_CHAIN?.split(',').map((m) => m.trim()).filter(Boolean) || [
    'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite',
  ];

const TRANSIENT_AI = /503|429|high demand|overloaded|service unavailable|temporarily/i;

async function extractSpecs(genAI: GoogleGenerativeAI, parts: { text: string }[] | unknown[]) {
  let lastError: unknown;

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await model.generateContent(parts as never);
        return JSON.parse(result.response.text());
      } catch (error: any) {
        lastError = error;
        const message = String(error?.message || '');
        // A retired/unknown model or bad image will fail everywhere: don't retry it.
        if (!TRANSIENT_AI.test(message)) break;
        if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }
  }

  throw lastError;
}

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
    const parts = [
      { text: PROMPT },
      { inlineData: { mimeType, data: imageBase64 } },
    ];

    try {
      const parsed = await extractSpecs(genAI, parts);
      return NextResponse.json({ success: true, data: parsed });
    } catch (error: any) {
      const message = String(error?.message || 'AI parsing error');
      if (TRANSIENT_AI.test(message)) {
        return NextResponse.json(
          { error: 'The AI is busy right now. Please try again in a moment.' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI parsing error' }, { status: 500 });
  }
}
