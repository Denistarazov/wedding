import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  name: string;
  contact: string;
  type: string;
  message: string;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, contact, type, message } = body as ContactPayload;

  if (!name?.trim() || !contact?.trim()) {
    return NextResponse.json({ error: 'name and contact are required' }, { status: 422 });
  }

  // Log submission server-side (replace with DB / email / Telegram bot in production)
  console.log('[contact]', {
    ts: new Date().toISOString(),
    name: name.trim(),
    contact: contact.trim(),
    type: type ?? 'unknown',
    message: message?.trim() ?? '',
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
