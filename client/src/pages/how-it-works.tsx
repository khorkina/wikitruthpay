import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
  const [, setLocation] = useLocation();

  return (
    <main className="container mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="wiki-content-section px-4 md:px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Wiki Truth Works</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Learn about the technology and methodology behind cross-cultural Wikipedia analysis.
        </p>

        <div className="space-y-8">
          {/* Process Overview */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">The Analysis Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">1. Article Discovery</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Search Wikipedia's vast database using real-time API integration. Get suggestions as you type.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-language text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">2. Language Detection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically discover all available language versions using Wikipedia's language links system.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-download text-2xl text-purple-600 dark:text-purple-400"></i>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">3. Content Retrieval</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fetch full article content from multiple Wikipedia language editions simultaneously.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-brain text-2xl text-orange-600 dark:text-orange-400"></i>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">4. AI Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced language models compare content and identify cultural perspectives and differences.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technical Architecture</h2>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    <i className="fas fa-cogs mr-2 text-blue-600 dark:text-blue-400"></i>Frontend Technology
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>React 18:</strong> Modern component-based user interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>TypeScript:</strong> Type-safe development for reliability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>IndexedDB:</strong> Local browser storage for privacy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>TanStack Query:</strong> Efficient data fetching and caching</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    <i className="fas fa-server mr-2 text-blue-600 dark:text-blue-400"></i>Backend Services
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>Wikipedia API:</strong> Direct real-time article access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>OpenRouter.ai:</strong> Meta Llama 3.1 AI models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>Express.js:</strong> Lightweight API server</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-chevron-right text-xs text-blue-600 dark:text-blue-400 mt-1"></i>
                      <span><strong>CORS Proxy:</strong> Cross-origin Wikipedia access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* AI Analysis Methodology */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Analysis Methodology</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                  <i className="fas fa-microscope mr-2"></i>Academic Analysis Mode
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                  Scholarly approach focusing on objective comparison and research-grade insights:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Factual differences and information variations</li>
                  <li>• Cultural perspectives and regional viewpoints</li>
                  <li>• Narrative emphasis and editorial choices</li>
                  <li>• Structural and organizational differences</li>
                  <li>• Source material and citation patterns</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                  <i className="fas fa-smile mr-2"></i>Fun Mode Analysis
                </h3>
                <p className="text-sm text-green-800 dark:text-green-400 mb-3">
                  Entertaining approach that highlights cultural quirks while remaining informative:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <li>• Humorous cultural biases and stereotypes</li>
                  <li>• Absurd differences in cultural priorities</li>
                  <li>• Witty observations about narrative framing</li>
                  <li>• Pop culture references and engaging commentary</li>
                  <li>• Entertaining while maintaining accuracy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Privacy & Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  <i className="fas fa-shield-alt mr-2 text-green-600 dark:text-green-400"></i>Data Protection
                </h3>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-600 dark:text-green-400 mt-1"></i>
                    <span>No user accounts or registration required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-600 dark:text-green-400 mt-1"></i>
                    <span>All data stored locally in your browser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-600 dark:text-green-400 mt-1"></i>
                    <span>No server-side data storage or tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-600 dark:text-green-400 mt-1"></i>
                    <span>GDPR compliant by design</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  <i className="fas fa-user-secret mr-2 text-blue-600 dark:text-blue-400"></i>Privacy Features
                </h3>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-blue-600 dark:text-blue-400 mt-1"></i>
                    <span>Complete data portability and export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-blue-600 dark:text-blue-400 mt-1"></i>
                    <span>One-click data deletion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-blue-600 dark:text-blue-400 mt-1"></i>
                    <span>No analytics or tracking scripts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-blue-600 dark:text-blue-400 mt-1"></i>
                    <span>Open-source and transparent</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content Handling */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Processing</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3">
                <i className="fas fa-compress-alt mr-2"></i>Large Article Handling
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-3">
                When Wikipedia articles exceed AI processing limits, we use intelligent truncation:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• Preserve article introductions (overview and key facts)</li>
                <li>• Maintain conclusions and recent information</li>
                <li>• Clearly mark truncated sections with "[CONTENT TRUNCATED FOR SIZE]"</li>
                <li>• Distribute available space equally among selected languages</li>
                <li>• Ensure meaningful analysis despite size constraints</li>
              </ul>
            </div>
          </section>

          {/* Call to Action */}
          <section>
            <div className="text-center bg-blue-600 dark:bg-blue-700 text-white rounded p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
              <p className="mb-6 opacity-90">
                Now that you understand how Wiki Truth works, start discovering cultural perspectives!
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setLocation('/search')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3"
                >
                  <i className="fas fa-search mr-2"></i>
                  Start Comparing
                </Button>
                <Button 
                  onClick={() => setLocation('/help')}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3"
                >
                  <i className="fas fa-question-circle mr-2"></i>
                  Get Help
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}