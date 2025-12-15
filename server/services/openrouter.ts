export interface ComparisonRequest {
  articles: Record<string, string>; // language code -> article content
  outputLanguage: string;
  isFunnyMode?: boolean;
}

export class OpenRouterService {
  // List of free models to try in order of preference
  private freeModels = [
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen-2.5-7b-instruct:free", 
    "microsoft/phi-3.5-mini-instruct:free",
    "mistralai/mistral-7b-instruct:free"
  ];

  async compareArticles(request: ComparisonRequest): Promise<string> {
    const { articles, outputLanguage, isFunnyMode = false } = request;
    
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured');
    }
    
    // Log the articles being compared for debugging
    console.log('Articles being compared:', Object.keys(articles));
    console.log('Article lengths:', Object.entries(articles).map(([lang, content]) => 
      `${lang}: ${content.length} characters`
    ));
    
    const systemPrompt = isFunnyMode 
      ? this.getFunnyModeSystemPrompt(outputLanguage)
      : this.getStandardSystemPrompt(outputLanguage);
    
    const userPrompt = this.buildUserPrompt(articles, isFunnyMode, outputLanguage);

    // Try each model in order until one works
    for (let i = 0; i < this.freeModels.length; i++) {
      const model = this.freeModels[i];
      console.log(`Attempting with model: ${model}`);
      
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:5000',
            'X-Title': 'WikiTruth',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: isFunnyMode ? 0.8 : 0.3,
            max_tokens: 2000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Model ${model} failed:`, errorText);
          
          // If this is the last model, throw the error
          if (i === this.freeModels.length - 1) {
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
          }
          
          // Otherwise, continue to next model
          continue;
        }

        const data = await response.json();
        const result = data.choices[0]?.message?.content;
        
        if (result) {
          console.log(`Successfully used model: ${model}`);
          return result;
        }
        
        // If no content returned, try next model
        if (i === this.freeModels.length - 1) {
          throw new Error('No comparison content generated from any model');
        }
        
      } catch (error) {
        console.error(`Model ${model} error:`, error);
        
        // If this is the last model, throw the error
        if (i === this.freeModels.length - 1) {
          throw new Error(`OpenRouter comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Otherwise, continue to next model
        continue;
      }
    }
    
    // This should never be reached, but just in case
    throw new Error('All OpenRouter models failed to generate comparison');
  }

  private truncateArticle(content: string, maxChars: number = 15000): string {
    if (content.length <= maxChars) {
      return content;
    }

    // Take first portion (intro/overview) and last portion (conclusion/recent info)
    const frontChars = Math.floor(maxChars * 0.7);
    const backChars = Math.floor(maxChars * 0.3);
    
    const frontPart = content.substring(0, frontChars);
    const backPart = content.substring(content.length - backChars);
    
    return `${frontPart}\n\n[... CONTENT TRUNCATED FOR SIZE ...]\n\n${backPart}`;
  }

  private buildUserPrompt(articles: Record<string, string>, isFunnyMode: boolean, outputLanguage: string): string {
    // Truncate articles to fit within token limits
    const truncatedArticles: Record<string, string> = {};
    const maxCharsPerArticle = Math.floor(25000 / Object.keys(articles).length); // Distribute available space
    
    for (const [lang, content] of Object.entries(articles)) {
      truncatedArticles[lang] = this.truncateArticle(content, maxCharsPerArticle);
      console.log(`Truncated ${lang} article: ${content.length} -> ${truncatedArticles[lang].length} characters`);
    }
    
    const articleData = JSON.stringify(truncatedArticles, null, 2);
    
    if (isFunnyMode) {
      return `Please compare these Wikipedia articles and provide insights in a humorous, entertaining way while still being informative. Respond in ${outputLanguage}:

${articleData}

Make the comparison engaging and fun while highlighting the interesting differences between how these different language versions present the topic.`;
    }

    return `Please compare these Wikipedia articles from different languages and provide a comprehensive analysis highlighting key differences, similarities, and cultural perspectives. Respond in ${outputLanguage}:

${articleData}

Focus on:
1. Content differences (facts, emphasis, details included/excluded)
2. Cultural perspectives and biases
3. Historical context variations
4. Notable differences in how the topic is presented
5. Any unique insights from each language version

Provide a thorough, balanced analysis that helps readers understand how the same topic can be presented differently across cultures and languages.`;
  }

  private getStandardSystemPrompt(outputLanguage: string): string {
    return `You are a Wikipedia comparison expert. Your task is to analyze Wikipedia articles from different languages about the same topic and provide insightful comparisons.

Key guidelines:
- Respond ONLY in ${outputLanguage}, never mix languages
- Focus on factual differences, not language quality
- Highlight cultural perspectives and regional emphasis
- Note any unique information found in specific language versions
- Be objective and balanced in your analysis
- Structure your response clearly with headers and bullet points
- Aim for comprehensive yet concise analysis

Your goal is to help users understand how different cultures and regions present the same topic through their Wikipedia articles.`;
  }

  private getFunnyModeSystemPrompt(outputLanguage: string): string {
    return `You are a witty Wikipedia comparison expert with a great sense of humor. Your task is to analyze Wikipedia articles from different languages and provide entertaining yet informative comparisons.

Key guidelines:
- Respond ONLY in ${outputLanguage}, never mix languages
- Make it funny and engaging while being factually accurate
- Use humor to highlight interesting differences between articles
- Point out amusing cultural quirks or biases with wit
- Include clever observations and light-hearted commentary
- Structure with entertaining headers and amusing bullet points
- Keep it informative despite the humorous tone

Your goal is to make Wikipedia comparison fun and memorable while genuinely helping users understand cultural differences in how topics are presented.`;
  }
}

export const openRouterService = new OpenRouterService();