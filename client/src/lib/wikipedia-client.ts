export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

export interface WikipediaLanguageLink {
  lang: string;
  title: string;
  url: string;
}

export interface WikipediaArticle {
  title: string;
  content: string;
  language: string;
  contentLength: number;
}

class WikipediaClient {
  private getCorsProxyUrl(url: string): string {
    // Use AllOrigins as a more reliable CORS proxy
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  }

  private getApiUrl(language: string): string {
    return `https://${language}.wikipedia.org/w/api.php`;
  }

  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      const apiUrl = this.getApiUrl(language);
      const params = new URLSearchParams({
        action: 'opensearch',
        search: query,
        limit: limit.toString(),
        namespace: '0',
        format: 'json',
        origin: '*'
      });

      const url = `${apiUrl}?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length < 4) {
        return [];
      }

      const [, titles, snippets, urls] = data;
      
      return titles.map((title: string, index: number) => ({
        title,
        snippet: snippets[index] || '',
        pageid: index + 1
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  async getLanguageLinks(title: string, language: string = 'en'): Promise<WikipediaLanguageLink[]> {
    try {
      const apiUrl = this.getApiUrl(language);
      const params = new URLSearchParams({
        action: 'query',
        titles: title,
        prop: 'langlinks',
        lllimit: '500',
        format: 'json',
        origin: '*'
      });

      const url = `${apiUrl}?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) return [];

      const pageId = Object.keys(pages)[0];
      const langlinks = pages[pageId]?.langlinks || [];

      const languageLinks = langlinks.map((link: any) => ({
        lang: link.lang,
        title: link['*'],
        url: `https://${link.lang}.wikipedia.org/wiki/${encodeURIComponent(link['*'])}`
      }));

      // Add the current language version
      languageLinks.unshift({
        lang: language,
        title: title,
        url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title)}`
      });

      return languageLinks;
    } catch (error) {
      console.error('Wikipedia language links error:', error);
      return [];
    }
  }

  async getArticleContent(title: string, language: string = 'en'): Promise<WikipediaArticle> {
    console.log(`Fetching article "${title}" in ${language}...`);
    
    const apiUrl = this.getApiUrl(language);
    const params = new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'extracts',
      exintro: 'false',
      explaintext: 'true',
      exsectionformat: 'plain',
      format: 'json',
      origin: '*'
    });

    const url = `${apiUrl}?${params}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) {
        throw new Error('No pages found in response');
      }

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (pageId === '-1' || !page) {
        throw new Error(`Article "${title}" not found`);
      }
      
      const content = page.extract || '';
      if (content.length < 100) {
        throw new Error(`Article "${title}" has insufficient content (${content.length} chars)`);
      }
      
      console.log(`✓ Fetched ${language}:${title} (${content.length} chars)`);
      
      return {
        title: page.title || title,
        content,
        language,
        contentLength: content.length
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`✗ Failed to fetch ${language}:${title}:`, errorMessage);
      throw new Error(`Failed to fetch ${language} article: ${errorMessage}`);
    }
  }

  async getMultipleArticleContents(
    articlesByLanguage: Record<string, string>, // language -> title
    baseLanguage: string = 'en'
  ): Promise<WikipediaArticle[]> {
    const articles: WikipediaArticle[] = [];
    
    console.log('Starting article fetch for:', articlesByLanguage);
    
    // Ensure we have at least the base language
    if (!articlesByLanguage[baseLanguage]) {
      console.error('Base language not found in article mapping');
      throw new Error(`Base language "${baseLanguage}" not found in language mapping`);
    }
    
    // Fetch articles sequentially to avoid rate limiting
    for (const [language, title] of Object.entries(articlesByLanguage)) {
      if (!title || title.trim() === '') {
        console.warn(`Skipping ${language}: empty title`);
        continue;
      }
      
      try {
        const article = await this.getArticleContent(title.trim(), language);
        articles.push(article);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Failed to fetch ${language} article "${title}":`, errorMessage);
        
        // If this is the base language and it fails, try with original search term
        if (language === baseLanguage && articles.length === 0) {
          console.log(`Retrying base language with fallback...`);
          try {
            const fallbackArticle = await this.getArticleContent(title.trim(), language);
            articles.push(fallbackArticle);
          } catch (fallbackError) {
            const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
            console.error(`Fallback also failed:`, fallbackMessage);
          }
        }
      }
      
      // Small delay to be respectful to Wikipedia's servers
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Fetched ${articles.length} out of ${Object.keys(articlesByLanguage).length} articles`);
    
    if (articles.length === 0) {
      throw new Error('No articles could be fetched. Please check that the article exists in the selected languages.');
    }
    
    return articles;
  }
}

export const wikipediaClient = new WikipediaClient();