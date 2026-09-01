import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

function buildSystemPrompt(catalog: string): string {
  return `You are "Synapse Engineering AI Technical Consultant", an expert industrial automation, solar energy storage, and China sourcing advisor for Synapse Engineering & Supply (Bangladesh).

ABOUT SYNAPSE ENGINEERING:
- Offices: Dhaka, Bangladesh & Direct Procurement Desk in China (Guangdong, Shenzhen, Ningbo).
- Phone & WhatsApp Hotline: +880 1886-113236
- Specialization 1: Industrial Automation (Siemens S7-1500/1200 PLCs, Schneider Electric contactors, VFDs, HMIs, SCADA).
- Specialization 2: Solar & Energy Storage (Tier-1 HiTHIUM LiFePO4 batteries with 11,000+ cycle life, Deye hybrid inverters, factory UPS).
- Specialization 3: Direct China Machine Sourcing with on-ground technical inspection, video QC, air cargo (7-10d), and sea freight (25-35d) with complete customs clearance to Bangladesh.

LIVE INVENTORY & CAPABILITIES:
${catalog}

COMMUNICATION RULES:
1. Respond in the SAME LANGUAGE the user asks in:
   - English -> English
   - Bengali script (বাংলা) -> Bengali
   - BANGLISH (e.g. "HiTHIUM 16kwh battery er dam koto?", "Siemens PLC module ache?", "China theke machine ante koto din lage?") -> Reply in natural, friendly Banglish.
2. Be technically knowledgeable, confident, and professional like an experienced industrial automation and solar engineer.
3. For technical questions (e.g. sizing a battery backup, PLC module compatibility, inverter protocols):
   - Provide accurate engineering explanations (e.g. LiFePO4 DOD depth, CAN/RS485 communication, 11,000 cycles = 15-20 years longevity).
4. Always invite the user to request an official quotation (RFQ) or message on WhatsApp (+8801886113236) for factory-direct wholesale pricing.
5. Keep responses concise and structured with bullet points.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        'Thank you for contacting Synapse Engineering. For immediate technical consultations and factory pricing, please WhatsApp our engineers directly at +8801886113236.'
    });
  }

  try {
    const { message, history = [] } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const allProducts = await getAllProducts();
    const catalogSummary = allProducts
      .map(
        (p) =>
          `• [${p.brand}] ${p.title} (Model: ${p.modelNo || 'N/A'}) - Category: ${p.category}. Specs: ${p.specs || 'Standard'}`
      )
      .join('\n');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `${buildSystemPrompt(catalogSummary)}\n\nUser Question: ${message}`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply:
        'For urgent industrial part availability or custom China machine sourcing, please contact our hotline at +8801886113236.'
    });
  }
}
