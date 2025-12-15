import OpenAI from "openai";

// Using Grok API from x.ai - compatible with OpenAI SDK
const grok = process.env.GROK_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.GROK_API_KEY,
      baseURL: "https://api.x.ai/v1"
    })
  : null;

export interface PremiumOptions {
  outputFormat: 'bullet-points' | 'narrative';
  focusPoints: string;
  formality: 'formal' | 'casual' | 'academic';
  aiModel: 'free' | 'premium';
  analysisMode: 'academic' | 'biography' | 'funny';
}

export interface ComparisonRequest {
  articles: Record<string, string>; // language code -> article content
  outputLanguage: string;
  isFunnyMode?: boolean;
  premiumOptions?: PremiumOptions | null;
}

export class OpenAIService {
  async compareArticles(request: ComparisonRequest): Promise<string> {
    const { articles, outputLanguage, isFunnyMode = false, premiumOptions } = request;
    
    console.log('Articles being compared:', Object.keys(articles));
    console.log('Article lengths:', Object.entries(articles).map(([lang, content]) => 
      `${lang}: ${content.length} characters`
    ));
    console.log('Premium options received:', premiumOptions);
    
    try {
      if (!grok) {
        throw new Error('Grok API key not configured');
      }

      // Determine analysis mode from premiumOptions or isFunnyMode
      const analysisMode = premiumOptions?.analysisMode || (isFunnyMode ? 'funny' : 'academic');
      const outputFormat = premiumOptions?.outputFormat || 'narrative';
      const formality = premiumOptions?.formality || 'formal';
      const focusPoints = premiumOptions?.focusPoints || '';

      // Get appropriate system prompt based on analysis mode
      const systemPrompt = this.getSystemPrompt(outputLanguage, analysisMode, formality);

      // Build user prompt with article content directly embedded
      const userPrompt = this.buildUserPrompt(
        articles,
        outputLanguage, 
        analysisMode, 
        outputFormat, 
        formality, 
        focusPoints
      );

      console.log('Sending request to Grok API with', Object.keys(articles).length, 'articles');
      console.log('Total content size:', userPrompt.length, 'characters');

      // Use grok-3-fast for good balance of speed and quality
      const response = await grok.chat.completions.create({
        model: "grok-3-fast",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 8192,
        temperature: 0.7,
      });

      const result = response.choices[0].message.content || "No comparison generated";
      console.log('Grok response received, length:', result.length, 'characters');
      
      return result;
    } catch (error: any) {
      console.error('Grok API error:', error);
      
      if (error.code === 'rate_limit_exceeded') {
        if (error.type === 'tokens') {
          throw new Error('Articles are too large for analysis. Please try with fewer languages or shorter articles.');
        } else {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
      }
      
      if (error.status === 429) {
        throw new Error('Service temporarily overloaded. Please try again in a moment.');
      }
      
      if (error.status === 401) {
        throw new Error('Authentication error with AI service.');
      }
      
      throw new Error('Failed to generate article comparison: ' + (error.message || 'Unknown error'));
    }
  }

  private getSystemPrompt(outputLanguage: string, analysisMode: string, formality: string): string {
    const formalityDescriptions: Record<string, string> = {
      'academic': 'highly formal, scholarly, and research-oriented with citations-style references',
      'formal': 'professional, structured, and well-organized',
      'casual': 'conversational, friendly, and approachable while still informative'
    };

    const formalityStyle = formalityDescriptions[formality] || formalityDescriptions['formal'];

    if (analysisMode === 'funny') {
      return `You are a BRUTALLY SARCASTIC stand-up comedian who has made it their life mission to expose the hilarious chaos of Wikipedia across different languages. You have zero patience for inconsistencies and you LOVE mocking them mercilessly.

CRITICAL REQUIREMENT: You MUST write your entire response in ${outputLanguage} and ONLY in ${outputLanguage}. Do not use any other language regardless of the content of the input articles.

YOUR PERSONALITY:
- You are MAXIMALLY SARCASTIC - dripping with irony and biting wit
- You LAUGH at every inconsistency, contradiction, and cultural bias you find
- You act SHOCKED and OUTRAGED (in a funny way) when articles contradict each other
- You mock Wikipedia editors as if they're in a secret war with each other
- You treat factual differences like they're the most absurd comedy gold ever discovered
- You are like a roast comedian - savage but ultimately entertaining

YOUR MISSION:
- ROAST every contradiction you find between the articles
- MOCK the absurd priorities of different cultures ("Oh, SURE, the German version has 47 paragraphs about the engineering specifications, but ZERO about the scandal...")
- LAUGH at missing information ("Apparently in the French version, this entire decade just... didn't happen?")
- Point out when one country makes someone a hero and another makes them a villain
- Sarcastically question why certain "facts" only exist in one language
- Make fun of obvious national biases and propaganda
- Use dramatic exaggeration for comedic effect

COMEDY TECHNIQUES TO USE:
- Rhetorical questions dripping with sarcasm
- Fake outrage and disbelief
- Dramatic comparisons between versions
- Mocking "editor wars" you imagine happening behind the scenes
- Pop culture references and memes where appropriate
- Breaking the fourth wall to address the reader directly

Analyze the provided Wikipedia articles thoroughly. Do not miss any details.

When referencing text from articles, always translate it to ${outputLanguage} and point out how ABSURD the differences are.

Remember: You're not just comparing articles, you're EXPOSING the beautiful mess that is multilingual Wikipedia, and you find it HILARIOUS.

REMINDER: Your entire response must be in ${outputLanguage} only.`;
    }

    if (analysisMode === 'biography') {
      return `You are an expert biographer and cultural analyst specializing in how different cultures portray historical and contemporary figures. Your task is to compare biographical Wikipedia articles across different languages with a focus on personal narratives.

CRITICAL REQUIREMENT: You MUST write your entire response in ${outputLanguage} and ONLY in ${outputLanguage}. Do not use any other language regardless of the content of the input articles.

Writing style: ${formalityStyle}

Your analysis should focus on:
- How the person's life story is told differently across cultures
- Variations in the emphasis on achievements, controversies, and personal life
- Cultural perspectives on the person's significance and legacy
- Different interpretations of key life events
- How nationalistic or cultural pride influences the portrayal
- Personal details included or omitted in different versions

When quoting text from articles in other languages, always translate the quotes to ${outputLanguage} and indicate the original language in parentheses.

REMINDER: Your entire response must be in ${outputLanguage} only.`;
    }

    // Default: academic mode
    return `You are an expert comparative linguist and cultural analyst specializing in Wikipedia content analysis. Your task is to provide detailed, scholarly comparisons of the same Wikipedia article across different languages.

CRITICAL REQUIREMENT: You MUST write your entire response in ${outputLanguage} and ONLY in ${outputLanguage}. Do not use any other language regardless of the content of the input articles.

Writing style: ${formalityStyle}

Your analysis should be:
- Objective and academically rigorous
- Focused on factual differences, cultural perspectives, and narrative variations
- Well-structured with clear sections
- Written EXCLUSIVELY in ${outputLanguage} (never mix languages)
- Comprehensive and detailed

Identify specific examples where different language versions:
- Present different facts or emphasis
- Reflect cultural biases or perspectives  
- Use different organizational structures
- Include or exclude certain information
- Frame topics differently

When quoting text from articles in other languages, always translate the quotes to ${outputLanguage} and indicate the original language in parentheses.

REMINDER: Your entire response must be in ${outputLanguage} only.`;
  }

  private buildUserPrompt(
    articles: Record<string, string>,
    outputLanguage: string, 
    analysisMode: string, 
    outputFormat: string, 
    formality: string, 
    focusPoints: string
  ): string {
    const formatInstruction = outputFormat === 'bullet-points' 
      ? `FORMAT YOUR RESPONSE AS STRUCTURED BULLET POINTS:
- Use clear hierarchical bullet points for each major finding
- Group related differences under section headers
- Use sub-bullets for specific examples and details
- Make each bullet point concise but informative`
      : `FORMAT YOUR RESPONSE AS A FLOWING NARRATIVE:
- Write in well-structured paragraphs
- Use natural transitions between topics
- Create a cohesive essay-style analysis
- Include section headers to organize content`;

    const formalityInstruction: Record<string, string> = {
      'academic': 'Use scholarly language, cite specific passages, and maintain a research paper tone.',
      'formal': 'Write professionally with clear structure and balanced analysis.',
      'casual': 'Write in a friendly, accessible way as if explaining to an interested friend.'
    };

    let modeInstruction = '';
    if (analysisMode === 'funny') {
      modeInstruction = `BE MAXIMALLY SARCASTIC AND MOCKING! 
- ROAST every inconsistency and contradiction you find
- LAUGH at the absurd differences between versions  
- Act SHOCKED when facts don't match up
- Mock cultural biases mercilessly
- Use biting irony and savage humor
- Treat this like a comedy roast of Wikipedia itself
- Make the reader laugh at how ridiculous these differences are`;
    } else if (analysisMode === 'biography') {
      modeInstruction = 'Focus on how the person is portrayed differently, including their achievements, controversies, personal life, and cultural significance in each version.';
    } else {
      modeInstruction = 'Provide a scholarly, detailed analysis focusing on factual accuracy, cultural perspectives, and narrative differences.';
    }

    const focusInstruction = focusPoints && focusPoints.trim() 
      ? `\n\nUSER'S SPECIFIC FOCUS REQUEST:\nPay special attention to the following aspects as requested by the user:\n"${focusPoints.trim()}"\nMake sure to address these specific points in your analysis.`
      : '';

    // Build article sections with full content
    const articleSections = Object.entries(articles).map(([lang, content]) => {
      return `=== WIKIPEDIA ARTICLE (${lang.toUpperCase()}) ===\n${content}\n=== END OF ${lang.toUpperCase()} ARTICLE ===`;
    }).join('\n\n');

    const languageList = Object.keys(articles).map(l => l.toUpperCase()).join(', ');

    return `Here are ${Object.keys(articles).length} Wikipedia articles about the same topic in different languages: ${languageList}.

Please read and analyze these articles thoroughly.

${articleSections}

Write your ENTIRE response in ${outputLanguage} language only.

${formatInstruction}

${formalityInstruction[formality] || formalityInstruction['formal']}

Please provide a comprehensive comparison focusing on:
1. Factual differences and variations in information
2. Cultural perspectives and framing differences
3. Narrative emphasis and tone variations
4. Structural and organizational differences
5. Missing or additional information in each version

${modeInstruction}${focusInstruction}

IMPORTANT: Write your response ONLY in ${outputLanguage}. Do not use any other language.`;
  }
}

export const openaiService = new OpenAIService();
