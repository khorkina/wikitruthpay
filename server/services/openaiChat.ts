import OpenAI from 'openai';

// Initialize Grok client (x.ai API) - compatible with OpenAI SDK
const grok = process.env.GROK_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.GROK_API_KEY,
      baseURL: "https://api.x.ai/v1"
    }) 
  : null;

export async function chatWithGrok(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  temperature = 0.7,
  maxTokens = 500,
  model = 'grok-4-latest'
) {
  if (!grok) {
    throw new Error('Grok API key not configured');
  }

  const resp = await grok.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return resp.choices[0].message.content?.trim() || '';
}