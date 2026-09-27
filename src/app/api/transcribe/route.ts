import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Converts a field voice note to text without exposing the Groq key to the browser. */
export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Voice transcription is not configured.' }, { status: 503 });

  try {
    const formData = await request.formData();
    const audio = formData.get('audio');
    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: 'Attach a non-empty audio file.' }, { status: 400 });
    }
    if (audio.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio must be 25 MB or smaller.' }, { status: 413 });
    }

    const upstream = new FormData();
    upstream.append('file', audio, audio.name || 'field-note.webm');
    upstream.append('model', 'whisper-large-v3-turbo');
    upstream.append('response_format', 'json');
    upstream.append('temperature', '0');
    upstream.append('prompt', 'Oil India infrastructure field report. Preserve activity codes, line numbers, kilometre values, piping terms, trenching, welding, hydrotest, and right of way terminology.');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) return NextResponse.json({ error: 'Transcription provider could not process this recording.' }, { status: 502 });
    const result = await response.json() as { text?: string };
    return NextResponse.json({ text: result.text?.trim() || '' });
  } catch {
    return NextResponse.json({ error: 'Unable to transcribe this voice note.' }, { status: 500 });
  }
}
