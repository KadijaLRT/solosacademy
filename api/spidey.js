// Vercel serverless function (optional). Keeps GROQ_API_KEY on the server.
// The app sends only a word and a unit name. Nothing else leaves the device.
//
// Model choice: tries GROQ_MODEL first (if you set it in Vercel), then a short list of Groq
// text models. If one is missing or your Groq project is not allowed to use it, the next is tried.
// Open /api/spidey in a browser (GET) to see which models your key can use.
const MODELS = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b'];
const URL_CHAT = 'https://api.groq.com/openai/v1/chat/completions';

function modelMissing(status, data) {
  const err = (data && data.error) || {};
  const msg = String(err.message || '');
  return status === 404 || err.code === 'model_not_found' || /does not exist|do not have access|not found|decommissioned/i.test(msg);
}

module.exports = async function handler(req, res) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'The story helper is not set up yet (missing GROQ_API_KEY).' });

  // Check page: which models can this key see?
  if (req.method === 'GET') {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: 'Bearer ' + key } });
      const data = await r.json();
      if (!r.ok) return res.status(502).json({ error: (data && data.error && data.error.message) || 'Groq error' });
      return res.status(200).json({ models: (data.data || []).map((m) => m.id).sort() });
    } catch (e) {
      return res.status(500).json({ error: 'Could not reach Groq.' });
    }
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const body = req.body || {};
  const clean = (s) => String(s || '').replace(/[^\p{L}\p{N} '-]/gu, '').slice(0, 40);
  const list = (process.env.GROQ_MODEL ? [process.env.GROQ_MODEL] : []).concat(MODELS).filter((m, i, a) => a.indexOf(m) === i);
  let lastError = 'Groq error';

  for (const model of list) {
    try {
      const payload = {
        model,
        temperature: 0.7,
        max_tokens: /gpt-oss/.test(model) ? 700 : 160,
        messages: [
          { role: 'system', content: 'You write tiny story lines for a 2 to 3 year old. Use Spidey from Spidey and His Amazing Friends. Max 8 words per sentence. Use simple words and clear consonants. Never use em dashes.' },
          { role: 'user', content: 'Unit: ' + clean(body.theme) + '. Word: ' + clean(body.en) + ' (Spanish: ' + clean(body.es) + '). Write 3 short English sentences, then the same 3 in Spanish.' }
        ]
      };
      if (/gpt-oss/.test(model)) payload.reasoning_effort = 'low';
      const r = await fetch(URL_CHAT, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await r.json();
      if (!r.ok) {
        lastError = (data && data.error && data.error.message) || 'Groq error';
        if (modelMissing(r.status, data)) continue; // try the next model
        return res.status(502).json({ error: lastError });
      }
      const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '').trim();
      if (!text) { lastError = 'Empty answer'; continue; }
      return res.status(200).json({ text, model });
    } catch (e) {
      return res.status(500).json({ error: 'Could not reach Groq.' });
    }
  }
  return res.status(502).json({ error: lastError + ' (tried: ' + list.join(', ') + ')' });
};
