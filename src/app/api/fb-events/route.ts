import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const hashData = (data: string) => {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

export async function POST(req: NextRequest) {
  try {
    const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ success: false, message: 'Meta CAPI not configured' });
    }

    const body = await req.json();
    const { eventName = 'Lead', eventId, product = {}, userData = {} } = body;

    const headersList = req.headers;
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || '';

    const formattedUserData: any = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (userData.phone) {
      let cleanPhone = userData.phone.replace(/[\s\-\+\(\)]/g, '');
      if (/^01\d{9}$/.test(cleanPhone)) {
        cleanPhone = '880' + cleanPhone;
      }
      formattedUserData.ph = [hashData(cleanPhone)];
    }

    if (userData.name) {
      formattedUserData.fn = [hashData(userData.name)];
    }

    if (userData.email) {
      formattedUserData.em = [hashData(userData.email)];
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: eventId || `evt-${Date.now()}`,
          event_source_url: headersList.get('referer') || 'https://synapse-engneering.com',
          user_data: formattedUserData,
          custom_data: {
            currency: 'BDT',
            content_name: product.title || 'Industrial Component / RFQ',
            content_type: 'product',
          },
        },
      ],
    };

    const response = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    return NextResponse.json({ success: true, data: responseData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
