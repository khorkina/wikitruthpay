export interface ComparisonRequest {
  articles: Record<string, string>; // language code -> article content
  outputLanguage: string;
  isFunnyMode?: boolean;
}

class OpenRouterClient {
  private baseUrl = '/api/openrouter';

  async compareArticles(request: ComparisonRequest): Promise<string> {
    try {
      console.log('Starting comparison with OpenRouter API...');

      // OpenRouter API endpoint - completely free for all users
      const response = await fetch('/api/openrouter/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      console.log('OpenRouter API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }
        
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || errorText}`);
      }

      const data = await response.json();
      console.log('OpenRouter comparison completed successfully');
      
      return data.comparisonResult || 'No comparison generated';
    } catch (error) {
      console.error('OpenRouter comparison error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate comparison');
    }
  }

  private getStandardSystemPrompt(outputLanguage: string): string {
    return `You are an expert cultural and linguistic analyst specializing in Wikipedia content comparison. Your task is to analyze and compare Wikipedia articles about the same topic across different languages, focusing on cultural perspectives, factual differences, and narrative variations.

ANALYSIS FRAMEWORK:
1. **Factual Differences**: Identify any differences in dates, numbers, events, or verifiable facts
2. **Cultural Perspectives**: Highlight how different cultures frame or emphasize aspects of the topic
3. **Narrative Focus**: Note what each language version prioritizes or emphasizes
4. **Missing Information**: Point out significant content present in some versions but absent in others
5. **Bias Detection**: Identify potential cultural, political, or historical biases in presentation

OUTPUT REQUIREMENTS:
- Respond in ${outputLanguage}
- Use clear, academic language
- Organize findings into the 5 categories above
- Provide specific examples with language references
- Maintain objectivity while highlighting differences
- Include a summary of key insights

Be thorough but concise. Focus on meaningful differences that reveal cultural perspectives rather than minor stylistic variations.`;
  }

  private getFunnyModeSystemPrompt(outputLanguage: string): string {
    return `You are a witty cultural commentator with a humorous take on how different cultures present the same topics on Wikipedia. Your job is to find the amusing, ironic, or delightfully weird differences between Wikipedia articles in different languages.

COMEDIC ANALYSIS APPROACH:
1. **Cultural Quirks**: Find funny ways different cultures emphasize unexpected aspects
2. **National Pride Moments**: Spot where countries subtly (or not so subtly) make themselves look better
3. **Lost in Translation**: Highlight amusing differences in how concepts are explained
4. **Bureaucratic Humor**: Point out overly formal or unnecessarily detailed sections
5. **The Elephant in the Room**: Note what some versions awkwardly avoid mentioning

OUTPUT STYLE:
- Respond in ${outputLanguage}
- Use humor while remaining respectful
- Include funny observations and light commentary
- Use analogies and witty comparisons
- Keep it educational but entertaining
- Add emoji where appropriate 😄

Remember: We're laughing WITH cultural differences, not AT them. Keep it light, fun, and insightful while avoiding anything mean-spirited or offensive.`;
  }
}

export const openaiClient = new OpenRouterClient();