// Vercel serverless function (optional). Keeps GROQ_API_KEY on the server.
// The app sends only a word and a unit name. Nothing else leaves the device.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'The story helper is not set up yet (missing GROQ_API_KEY).' });

  const body = req.body || {};
  const clean = (s) => String(s || '').replace(/[^\p{L}\p{N} '-]/gu, '').slice(0, 40);
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 160,
        messages: [
          { role: 'system', content: 'You write tiny story lines for a 2 to 3 year old. Use Spidey from Spidey and His Amazing Friends. Max 8 words per sentence. Use simple words and clear consonants. Never use em dashes.' },
          { role: 'user', content: 'Unit: ' + clean(body.theme) + '. Word: ' + clean(body.en) + ' (Spanish: ' + clean(body.es) + '). Write 3 short English sentences, then the same 3 in Spanish.' }
        ]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: (data && data.error && data.error.message) || 'Groq error' });
    return res.status(200).json({ text: (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '').trim() });
  } catch (e) {
    return res.status(500).json({ error: 'Could not reach Groq.' });
  }
};
