import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isAuthenticatedAdmin } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  const isAuthed = await isAuthenticatedAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text, imageBase64, mimeType } = await req.json();

    if (!text && !imageBase64) {
      return NextResponse.json(
        { error: 'Provide either raw text message or screenshot image' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `You are an expert e-commerce order parser for a Bangladeshi merchant.
Given a raw customer message or screenshot from Facebook/WhatsApp (in Bengali, English, or Banglish), extract the order details into this EXACT JSON format:
{
  "name": "Customer Full Name",
  "phone": "01XXXXXXXXX (clean 11-digit BD phone or international)",
  "address": "Full delivery address including area, Thana, District",
  "productHint": "The product or item mentioned (e.g. 140W GaN charger, PowerHub 600W, Siemens S7-1200)",
  "amountHint": 0,
  "deliveryZone": "dhaka" | "suburb" | "outside",
  "paymentMethod": "cod" | "bkash" | "nagad"
}
Only output valid JSON with no markdown formatting.`;

    const parts: any[] = [{ text: prompt }];

    if (text) {
      parts.push({ text: `Customer Message:\n${text}` });
    }

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg'
        }
      });
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText || '{}');

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Parse order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse order' }, { status: 500 });
  }
}
