// Direct HTTP function: the contact form POSTs form data here and we push it
// straight to Telegram. No dependency on Netlify Forms detection.
// Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars (Netlify UI).

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  isBase64Encoded?: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Имя',
  channel: 'Контакт',
  contact: 'Контакт',
  type: 'Тип проекта',
  niche: 'Ниша',
  message: 'Сообщение',
  desc: 'Описание',
  link: 'Ссылка',
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const json = (status: number, data: unknown) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method not allowed' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    return json(500, { error: 'not configured' });
  }

  const raw = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, 'base64').toString('utf-8')
    : (event.body ?? '');

  const params = new URLSearchParams(raw);

  // Honeypot: if the hidden bot-field is filled, silently accept and drop.
  if (params.get('bot-field')) return json(200, { ok: true });

  const lines: string[] = [];
  for (const [k, v] of params) {
    if (k === 'bot-field' || k === 'form-name' || !v.trim()) continue;
    const label = FIELD_LABELS[k] ?? k;
    lines.push(`<b>${escapeHtml(label)}:</b> ${escapeHtml(v)}`);
  }

  if (lines.length === 0) return json(400, { error: 'empty submission' });

  const formName = params.get('form-name') || 'contact';
  const date = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Warsaw',
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const text = `📬 <b>Новая заявка</b> [${escapeHtml(formName)}]\n\n${lines.join('\n')}\n\n<i>${date}</i>`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    console.error('[notify] Telegram API error:', await res.text());
    return json(502, { error: 'telegram failed' });
  }

  return json(200, { ok: true });
}
