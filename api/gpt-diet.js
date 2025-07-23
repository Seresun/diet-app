/* eslint-env node */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { diagnosis } = req.body;
  if (!diagnosis) {
    return res.status(400).json({ error: 'Missing diagnosis' });
  }

  const prompt = `You are a medical nutritionist. A patient has "${diagnosis}".\nProvide recommendations in this format:\n1. Overview\n2. Recommended foods\n3. Foods to avoid\n4. Sample menu (with meal times and alternatives)\n5. Lifestyle advice`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'OpenAI API error' });
    }
    res.status(200).json({ response: data.choices?.[0]?.message?.content || 'No reply' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
} 