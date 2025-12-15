// Quick test to check OpenAI API functionality
// Run this in browser console to test the API directly

async function testOpenAI() {
  const apiKey = localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    console.log('No API key found in localStorage');
    return;
  }
  
  console.log('API key found, testing...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    console.log('Models API response:', response.status);
    
    if (response.ok) {
      console.log('API key is valid');
      
      // Test simple completion
      const testResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'user', content: 'Say "API test successful"' }
          ],
          max_tokens: 10
        })
      });
      
      console.log('Chat completion response:', testResponse.status);
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log('Test result:', data.choices[0].message.content);
      } else {
        const error = await testResponse.text();
        console.error('Chat completion error:', error);
      }
    } else {
      const error = await response.text();
      console.error('API key validation failed:', error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
testOpenAI();