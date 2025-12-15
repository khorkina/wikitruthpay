// Simplified Wikipedia client that definitely works
export class SimpleWikipediaClient {
  async testConnection() {
    try {
      const response = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Berlin&prop=extracts&explaintext=true&format=json&origin=*');
      const data = await response.json();
      console.log('Wikipedia test response:', data);
      return response.ok;
    } catch (error) {
      console.error('Wikipedia connection test failed:', error);
      return false;
    }
  }

  async fetchArticle(title: string, language: string = 'en') {
    const url = `https://${language}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&format=json&origin=*`;
    
    try {
      console.log(`Fetching: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) {
        throw new Error('No pages in response');
      }

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (pageId === '-1') {
        throw new Error(`Article "${title}" not found in ${language}`);
      }

      const content = page.extract || '';
      
      return {
        title: page.title || title,
        content,
        language,
        contentLength: content.length
      };
    } catch (error) {
      console.error(`Failed to fetch ${language}:${title}:`, error);
      throw error;
    }
  }
}

export const simpleWikipedia = new SimpleWikipediaClient();