// Test function to validate Wikipedia API integration
export async function testWikipediaAPI() {
  try {
    console.log('Testing Wikipedia API...');
    
    // Test 1: Search functionality
    const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=Berlin&limit=3&namespace=0&format=json&origin=*';
    const searchResponse = await fetch(searchUrl);
    console.log('Search test:', searchResponse.ok, await searchResponse.json());
    
    // Test 2: Article content
    const contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=Berlin&prop=extracts&exintro=false&explaintext=true&exsectionformat=plain&format=json&origin=*';
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();
    console.log('Content test:', contentResponse.ok, contentData);
    
    // Test 3: Language links
    const langUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=Berlin&prop=langlinks&lllimit=5&format=json&origin=*';
    const langResponse = await fetch(langUrl);
    const langData = await langResponse.json();
    console.log('Language links test:', langResponse.ok, langData);
    
    return { success: true, message: 'All tests passed' };
  } catch (error) {
    console.error('Wikipedia API test failed:', error);
    return { success: false, error };
  }
}