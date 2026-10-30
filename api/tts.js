// Vercel serverless function (optional). A natural English voice from Groq. Keeps GROQ_API_KEY on the server.
// Only short English text goes out. Spanish and other languages stay on the device voice.
// First time: open https://console.groq.com/playground?model=canopylabs%2Forpheus-v1-english and accept the model terms.
const URL_TTS = 'https://api.groq.com/openai/v1/audio/speech';
const MODEL = process.env.GROQ_TTS_MODEL || 'canopylabs/orpheus-v1-english';
const VOICES = ['hannah', 'diana', 'autumn', 'austin', 'daniel', 'troy'];

module.exports = async function handler(req, res) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'Natural voice is not set up yet (missing GROQ_API_KEY).' });
  if (req.method === 'GET') return res.status(200).json({ ok: true, model: MODEL, voices: VOICES });
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = req.body || {};
  const text = String(body.text || '').replace(/[^\p{L}\p{N} .,!?'-]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 190);
  if (!text) return res.status(400).json({ error: 'No text' });
  const voice = VOICES.indexOf(body.voice) >= 0 ? body.voice : (process.env.GROQ_TTS_VOICE || 'hannah');
  try {
    const r = await fetch(URL_TTS, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, voice, input: text, response_format: 'wav' })
    });
    if (!r.ok) {
      let msg = 'Groq voice error';
      try { const d = await r.json(); msg = (d && d.error && d.error.message) || msg; } catch (e) { /* ignore */ }
      return res.status(502).json({ error: msg });
    }
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(buf);
  } catch (e) {
    return res.status(500).json({ error: 'Could not reach Groq.' });
  }
};
