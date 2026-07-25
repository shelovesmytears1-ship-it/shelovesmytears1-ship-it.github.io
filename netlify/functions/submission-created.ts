// Triggered automatically by Netlify Forms on every submission.
// Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Netlify UI → Site config → Environment variables.

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

interface FormPayload {
  form_name: string;
  created_at: string;
  human_fields?: Record<string, string>;
  data?: Record<string, string>;
  site_url?: string;
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

function formatMessage(payload: FormPayload): string {
  const fields = payload.human_fields ?? payload.data ?? {};

  const lines = Object.entries(fields)
    .filter(([k]) => k !== 'bot-field' && k !== 'form-name')
    .map(([k, v]) => {
      const label = FIELD_LABELS[k] ?? k;
      return `<b>${escapeHtml(label)}:</b> ${escapeHtml(String(v))}`;
    })
    .join('\n');

  const date = new Date(payload.created_at).toLocaleString('ru-RU', {
    timeZone: 'Europe/Warsaw',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `📬 <b>Новая заявка</b> [${escapeHtml(payload.form_name)}]\n\n${lines}\n\n<i>${date}</i>`;
}

export async function handler(event: NetlifyEvent) {
  if (!event.body) return { statusCode: 200, body: 'ok' };

  let parsed: { payload?: FormPayload };
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'bad json' };
  }

  const payload = parsed.payload;
  if (!payload) return { statusCode: 200, body: 'ok' };

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping');
    return { statusCode: 200, body: 'ok' };
  }

  const text = formatMessage(payload);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[notify] Telegram API error:', err);
    return { statusCode: 502, body: 'telegram error' };
  }

  return { statusCode: 200, body: 'ok' };
}
