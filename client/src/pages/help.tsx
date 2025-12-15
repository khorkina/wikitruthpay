import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
  const [, setLocation] = useLocation();

  return (
    <main className="container mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="wiki-content-section px-4 md:px-6">
        <h1 className="wiki-article-title">Help & Support</h1>
        <p className="text-wiki-gray mb-6">
          Learn how to use Wiki Truth effectively and get answers to common questions.
        </p>

        <div className="space-y-8">
          {/* Getting Started */}
          <section>
            <h2 className="wiki-section-title">Getting Started</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  <i className="fas fa-play-circle mr-2 text-blue-600 dark:text-blue-400"></i>Quick Start Guide
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Search for any Wikipedia article using the search box</li>
                  <li>Select the article you want to analyze from the suggestions</li>
                  <li>Choose 2-5 language versions to compare</li>
                  <li>Pick your preferred output language and analysis mode</li>
                  <li>Click "Start Analysis" and wait for AI-powered results</li>
                </ol>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="wiki-section-title">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  What's the difference between Free and Premium?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  <strong>Free:</strong> Unlimited comparisons with Meta Llama AI analysis. No subscription required, all data stored locally in your browser.
                  <br/><br/>
                  <strong>Premium ($10/month):</strong> Advanced OpenAI GPT-4o analysis with enhanced features, customization options, and post-comparison chat functionality.
                </div>
              </details>

              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  How many languages can I compare at once?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  You can compare 2-5 language versions in a single analysis. This range provides meaningful insights while keeping the analysis focused and readable.
                </div>
              </details>

              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  What's the difference between Academic and Fun Mode?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  Academic Mode provides scholarly, objective analysis suitable for research. Fun Mode offers entertaining, humorous insights while still being informative - perfect for discovering cultural quirks and biases in an engaging way.
                </div>
              </details>

              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  Where is my data stored?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  All your comparison history is stored locally in your browser using IndexedDB. No data is sent to external servers except during the AI analysis process. You have complete control over your data.
                </div>
              </details>

              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  Why do some articles show "[CONTENT TRUNCATED FOR SIZE]"?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  Very long Wikipedia articles are automatically truncated to fit within AI processing limits. We preserve the beginning (overview) and end (recent information) of articles to maintain meaningful analysis while staying within technical constraints.
                </div>
              </details>

              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  Can I export my comparison results?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  Yes! Each comparison has a "Copy to Clipboard" button to copy the full analysis text. You can also export all your data from the Tools page as a JSON file.
                </div>
              </details>
            </div>
          </section>

          {/* Tips & Tricks */}
          <section>
            <h2 className="wiki-section-title">Tips & Tricks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  <i className="fas fa-lightbulb mr-2"></i>Best Topics to Compare
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>Historical figures and events</li>
                  <li>Countries and cities</li>
                  <li>Political concepts and systems</li>
                  <li>Scientific discoveries and theories</li>
                  <li>Cultural and religious topics</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  <i className="fas fa-star mr-2"></i>Pro Tips
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                  <li>Try comparing articles from different regions</li>
                  <li>Use Fun Mode for entertaining cultural insights</li>
                  <li>Compare controversial topics for varied perspectives</li>
                  <li>Mix languages from different language families</li>
                  <li>Save interesting results for future reference</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Premium Payment Guide */}
          <section>
            <h2 className="wiki-section-title">Premium Payment Guide</h2>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-4">
                  <i className="fas fa-credit-card mr-2"></i>How to Subscribe to Premium ($10/month)
                </h3>
                
                <div className="space-y-4 text-sm text-green-800 dark:text-green-300">
                  <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Step 1: Access Payment</h4>
                    <p>Click the "Upgrade to Premium" button in Settings or during language selection to open the secure NowPayments widget.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Step 2: Choose Payment Method</h4>
                    <p>NowPayments supports 400+ cryptocurrencies and traditional payment methods:</p>
                    <ul className="mt-2 ml-4 space-y-1">
                      <li><strong>Cryptocurrencies:</strong> Bitcoin (BTC), Ethereum (ETH), USDT, USDC, Litecoin (LTC), and many more</li>
                      <li><strong>Traditional Methods:</strong> Credit/debit cards, bank transfers (where available)</li>
                      <li><strong>Popular Wallets:</strong> MetaMask, Trust Wallet, Coinbase Wallet integration</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Step 3: Complete Payment</h4>
                    <ul className="space-y-1">
                      <li>The widget will show the exact amount needed in your chosen currency</li>
                      <li>For crypto: Scan the QR code or copy the wallet address</li>
                      <li>For cards: Enter your payment details securely</li>
                      <li>Payment confirmation typically takes 1-5 minutes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Step 4: Subscription Activation</h4>
                    <p>Once payment is confirmed, your premium subscription activates immediately for 30 days. No automatic renewal - you control when to extend your subscription.</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <i className="fas fa-shield-alt mr-1"></i>
                    <strong>Security:</strong> All payments are processed through NowPayments' secure infrastructure. Wiki Truth never stores your payment information.
                  </p>
                </div>
              </div>
              
              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  What if my payment fails or I need help?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <p><strong>Common Issues:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li><strong>Low crypto amount:</strong> Ensure the payment meets minimum network requirements (usually ~$5 USD equivalent)</li>
                    <li><strong>Network delays:</strong> Crypto payments can take 10-30 minutes during network congestion</li>
                    <li><strong>Wrong address:</strong> Always copy the exact address from the payment widget</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Need Support?</strong> Visit our <a href="/contact-us" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Us</a> page for assistance with payment issues.
                  </p>
                </div>
              </details>
              
              <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">
                  <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                  Why cryptocurrency payments?
                </summary>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  Cryptocurrency payments align with our privacy-first approach - no personal financial data is required, and payments are processed globally without geographic restrictions. We also accept traditional payment methods where available.
                </div>
              </details>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="wiki-section-title">Need More Help?</h2>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Wiki Truth combines privacy-first architecture with powerful AI analysis.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button 
                  onClick={() => setLocation('/about')}
                  className="wiki-button"
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  Learn More About Wiki Truth
                </Button>
                <Button 
                  onClick={() => setLocation('/search')}
                  className="wiki-button-primary"
                >
                  <i className="fas fa-search mr-2"></i>
                  Start Comparing
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}