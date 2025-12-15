import axios from 'axios';
import { WikipediaSearchResult, WikipediaLanguageLink, WikipediaArticle } from '@shared/schema';

export class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private apiUrl = 'https://en.wikipedia.org/w/api.php';

  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      // Enhanced search with better parameters and filtering
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          srlimit: Math.min(limit * 2, 20), // Get more results to filter
          srnamespace: 0, // Main namespace only
          format: 'json',
          srinfo: 'snippet|totalhits|suggestion',
          srprop: 'snippet|size|wordcount|timestamp|categorysnippet',
          srsort: 'relevance',
          srqiprofile: 'engine_autoselect' // Use best search profile
        },
        timeout: 4000,
        headers: {
          'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
        }
      });

      const searchResults = response.data.query?.search || [];
      
      // Filter and score results for better quality
      const filteredResults = searchResults
        .filter((result: any) => {
          // Filter out low-quality results
          if (!result.title || result.title.length < 2) return false;
          if (result.size < 1000) return false; // Skip very short articles
          if (result.wordcount < 100) return false; // Skip stub articles
          
          // Filter out common disambiguation and maintenance pages
          const title = result.title.toLowerCase();
          if (title.includes('disambiguation') || 
              title.includes('(disambiguation)') ||
              title.includes('category:') ||
              title.includes('template:') ||
              title.includes('user:') ||
              title.includes('talk:') ||
              title.includes('file:') ||
              title.includes('wikipedia:')) {
            return false;
          }
          
          return true;
        })
        .map((result: any) => {
          // Calculate relevance score
          let score = 0;
          const title = result.title.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Exact title match gets highest score
          if (title === queryLower) score += 100;
          // Title starts with query gets high score
          else if (title.startsWith(queryLower)) score += 80;
          // Title contains query gets medium score
          else if (title.includes(queryLower)) score += 60;
          
          // Boost score for longer, more comprehensive articles
          if (result.wordcount > 1000) score += 20;
          if (result.wordcount > 5000) score += 10;
          
          // Boost recent articles slightly
          if (result.timestamp) {
            const articleDate = new Date(result.timestamp);
            const now = new Date();
            const monthsOld = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (monthsOld < 12) score += 5; // Recent updates
          }
          
          return {
            title: result.title,
            snippet: this.cleanSnippet(result.snippet || ''),
            pageid: result.pageid,
            score: score,
            wordcount: result.wordcount,
            size: result.size
          };
        })
        .sort((a: any, b: any) => b.score - a.score) // Sort by relevance score
        .slice(0, limit) // Take only requested amount
        .map(({ score, wordcount, size, ...result }: any) => result); // Remove scoring fields
      
      return filteredResults;
    } catch (error) {
      console.error('Wikipedia search error:', error);
      // Enhanced fallback with better suggestion handling
      try {
        const fallbackResponse = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
          params: {
            action: 'opensearch',
            search: query,
            limit: Math.min(limit * 2, 15),
            namespace: 0,
            format: 'json',
            suggest: true,
            redirects: 'resolve'
          },
          timeout: 3000,
          headers: {
            'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
          }
        });

        const [, titles, snippets, urls] = fallbackResponse.data;
        
        return titles
          .map((title: string, index: number) => ({
            title,
            snippet: this.cleanSnippet(snippets[index] || ''),
            pageid: index + 1000000,
            url: urls[index]
          }))
          .filter((result: any) => {
            // Apply same quality filters for fallback
            const title = result.title.toLowerCase();
            return !title.includes('disambiguation') && 
                   !title.includes('category:') &&
                   !title.includes('template:') &&
                   result.title.length > 2;
          })
          .slice(0, limit);
      } catch (fallbackError) {
        console.error('Wikipedia fallback search error:', fallbackError);
        throw new Error('Failed to search Wikipedia articles');
      }
    }
  }

  async getLanguageLinks(title: string, language: string = 'en'): Promise<WikipediaLanguageLink[]> {
    try {
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          titles: title,
          prop: 'langlinks',
          lllimit: 500,
          format: 'json'
        },
        timeout: 4000, // Faster language links
        headers: {
          'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
        }
      });

      const pages = response.data.query.pages;
      const page = Object.values(pages)[0] as any;
      
      if (!page.langlinks) {
        return [];
      }

      return page.langlinks.map((link: any) => ({
        lang: link.lang,
        title: link['*'],
        url: `https://${link.lang}.wikipedia.org/wiki/${encodeURIComponent(link['*'])}`
      }));
    } catch (error) {
      console.error('Wikipedia language links error:', error);
      throw new Error('Failed to fetch language links');
    }
  }

  async getArticleContent(title: string, language: string = 'en'): Promise<WikipediaArticle> {
    try {
      // Use TextExtracts API with no character limit for full article content
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          titles: title,
          prop: 'extracts|pageids|revisions',
          rvprop: 'content',
          rvslots: 'main',
          exintro: false,
          explaintext: true,
          exsectionformat: 'plain',
          format: 'json'
        },
        timeout: 30000,
        headers: {
          'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
        }
      });

      const pages = response.data.query.pages;
      const page = Object.values(pages)[0] as any;
      
      if (page.missing) {
        throw new Error(`Article "${title}" not found in ${language} Wikipedia`);
      }

      // Try to get content from revisions (full wikitext) first, then fall back to extract
      let content = '';
      
      // Get plain text extract (may be truncated by API)
      const extract = page.extract || '';
      
      // Get wikitext from revisions for full content
      if (page.revisions && page.revisions[0]?.slots?.main?.['*']) {
        const wikitext = page.revisions[0].slots.main['*'];
        // Convert wikitext to plain text (basic conversion)
        content = this.wikitextToPlainText(wikitext);
      } else if (extract.length > 100) {
        content = extract;
      }
      
      // If still short, try fetching via parse API for full rendered content
      if (content.length < 1000) {
        try {
          const parseResponse = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
            params: {
              action: 'parse',
              page: title,
              prop: 'text',
              format: 'json',
              disabletoc: true,
              disableeditsection: true
            },
            timeout: 30000,
            headers: {
              'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
            }
          });
          
          if (parseResponse.data.parse?.text?.['*']) {
            const htmlContent = parseResponse.data.parse.text['*'];
            content = this.htmlToPlainText(htmlContent);
          }
        } catch (parseError) {
          console.warn('Parse API fallback failed:', parseError);
        }
      }
      
      console.log(`Fetched article "${title}" (${language}): ${content.length} characters`);
      
      return {
        pageid: page.pageid,
        title: page.title,
        content: content,
        language,
        contentLength: content.length
      };
    } catch (error) {
      console.error('Wikipedia content error:', error);
      throw new Error(`Failed to fetch article content for "${title}" in ${language}`);
    }
  }

  // Convert wikitext to plain text (basic conversion)
  private wikitextToPlainText(wikitext: string): string {
    if (!wikitext) return '';
    
    let text = wikitext
      // Remove templates like {{...}}
      .replace(/\{\{[^{}]*\}\}/g, '')
      // Remove nested templates
      .replace(/\{\{[^{}]*\{\{[^{}]*\}\}[^{}]*\}\}/g, '')
      // Remove categories
      .replace(/\[\[Category:[^\]]+\]\]/gi, '')
      .replace(/\[\[Категория:[^\]]+\]\]/gi, '')
      // Convert wiki links [[Link|Text]] to Text
      .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
      // Convert simple wiki links [[Link]] to Link
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      // Remove external links [http://... text] -> text
      .replace(/\[https?:\/\/[^\s\]]+ ([^\]]+)\]/g, '$1')
      // Remove bare external links
      .replace(/\[https?:\/\/[^\]]+\]/g, '')
      // Remove refs
      .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
      .replace(/<ref[^>]*\/>/g, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, '')
      // Convert headers == Header == to plain text
      .replace(/^=+\s*([^=]+)\s*=+$/gm, '\n$1\n')
      // Remove bold/italic markers
      .replace(/'{2,}/g, '')
      // Remove magic words
      .replace(/__[A-Z]+__/g, '')
      // Clean up multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Clean up whitespace
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    return text;
  }

  // Convert HTML to plain text
  private htmlToPlainText(html: string): string {
    if (!html) return '';
    
    let text = html
      // Remove script and style elements
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Remove reference sections
      .replace(/<sup[^>]*class="[^"]*reference[^"]*"[^>]*>[\s\S]*?<\/sup>/gi, '')
      // Remove edit links
      .replace(/<span[^>]*class="[^"]*mw-editsection[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
      // Remove navigation boxes
      .replace(/<div[^>]*class="[^"]*navbox[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<table[^>]*class="[^"]*navbox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
      // Remove infoboxes
      .replace(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
      // Remove table of contents
      .replace(/<div[^>]*id="toc"[^>]*>[\s\S]*?<\/div>/gi, '')
      // Add newlines for block elements
      .replace(/<\/?(?:p|div|h[1-6]|li|tr|br)[^>]*>/gi, '\n')
      // Remove all remaining HTML tags
      .replace(/<[^>]+>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&#\d+;/g, '')
      // Clean up whitespace
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    return text;
  }

  async getMultipleArticleContents(title: string, languages: string[], baseLanguage: string = 'en'): Promise<WikipediaArticle[]> {
    try {
      // First get language links to find the correct titles for each language
      const languageLinks = await this.getLanguageLinks(title, baseLanguage);
      
      // Create a map of language to title
      const languageTitleMap: Record<string, string> = {
        [baseLanguage]: title // Include the base article
      };
      
      languageLinks.forEach(link => {
        languageTitleMap[link.lang] = link.title;
      });

      // Fetch articles for the requested languages
      const promises = languages.map(async (lang) => {
        const articleTitle = languageTitleMap[lang];
        if (!articleTitle) {
          console.warn(`No title found for language ${lang}`);
          return null;
        }
        
        try {
          return await this.getArticleContent(articleTitle, lang);
        } catch (error) {
          console.warn(`Failed to fetch article for ${lang}:`, error);
          return null;
        }
      });
      
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<WikipediaArticle> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
    } catch (error) {
      console.error('Multiple articles fetch error:', error);
      throw new Error('Failed to fetch multiple article contents');
    }
  }

  // Helper method to clean and improve snippet display
  private cleanSnippet(snippet: string): string {
    if (!snippet) return '';
    
    // Remove HTML tags but preserve structure
    let cleaned = snippet
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
    
    // Ensure snippet ends properly
    if (cleaned.length > 150) {
      cleaned = cleaned.substring(0, 147) + '...';
    }
    
    // Remove incomplete sentences at the end
    const lastPeriod = cleaned.lastIndexOf('.');
    const lastExclamation = cleaned.lastIndexOf('!');
    const lastQuestion = cleaned.lastIndexOf('?');
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 50 && lastSentenceEnd < cleaned.length - 10) {
      cleaned = cleaned.substring(0, lastSentenceEnd + 1);
    }
    
    return cleaned;
  }
}

export const wikipediaService = new WikipediaService();
