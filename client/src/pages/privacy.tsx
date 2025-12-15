import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const [, setLocation] = useLocation();

  return (
    <main className="container mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="wiki-content-section px-4 md:px-6">
        <h1 className="wiki-article-title">Privacy Policy</h1>
        <p className="text-wiki-gray mb-6">
          Your privacy is fundamental to Wiki Truth. Learn how we protect your data and ensure complete privacy.
        </p>

        <div className="space-y-8">
          {/* Privacy Summary */}
          <section>
            <div className="bg-green-50 border border-green-200 rounded p-6">
              <h2 className="font-semibold text-green-900 mb-3">
                <i className="fas fa-shield-alt mr-2"></i>Privacy Summary
              </h2>
              <p className="text-green-800 mb-3">
                Wiki Truth is designed with privacy-first principles:
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>No accounts required</strong> - Use the service completely anonymously</li>
                <li>• <strong>Local storage only</strong> - All data stays in your browser</li>
                <li>• <strong>No tracking</strong> - No analytics, cookies, or user profiling</li>
                <li>• <strong>No server storage</strong> - We don't store any comparison data</li>
                <li>• <strong>Open source</strong> - Code is transparent and auditable</li>
              </ul>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="wiki-section-title">Data Collection</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-6">
              <h3 className="font-semibold mb-3">What We DO NOT Collect</h3>
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>Personal information (name, email, address)</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>User accounts or login credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>IP addresses or device fingerprints</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>Usage analytics or tracking data</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>Cookies for tracking purposes</span>
                </li>
              </ul>

              <h3 className="font-semibold mb-3">What We DO Collect</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Article content temporarily during AI analysis (deleted immediately after)</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Basic error logs for system functionality (no personal data)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Local Storage */}
          <section>
            <h2 className="wiki-section-title">Local Data Storage</h2>
            <div className="bg-blue-50 border border-blue-200 rounded p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                <i className="fas fa-database mr-2"></i>Browser Storage
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                All your comparison data is stored locally in your browser using IndexedDB:
              </p>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• <strong>Comparison results:</strong> Your AI-generated analyses</li>
                <li>• <strong>Search history:</strong> Articles you've compared</li>
                <li>• <strong>User preferences:</strong> Language and theme settings</li>
                <li>• <strong>Session data:</strong> Temporary comparison state</li>
              </ul>
              
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p className="text-sm text-blue-800">
                  <i className="fas fa-info-circle mr-2"></i>
                  This data never leaves your device and is completely under your control.
                </p>
              </div>
            </div>
          </section>

          {/* External Services */}
          <section>
            <h2 className="wiki-section-title">External Services</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold mb-2">
                  <i className="fab fa-wikipedia-w mr-2 text-gray-600"></i>Wikipedia API
                </h3>
                <p className="text-sm text-gray-700">
                  We access Wikipedia's public API to retrieve article content. This is done directly from your browser 
                  using Wikipedia's official endpoints. No personal data is sent to Wikipedia.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold mb-2">
                  <i className="fas fa-brain mr-2 text-purple-600"></i>OpenRouter.ai
                </h3>
                <p className="text-sm text-gray-700">
                  Article content is sent to OpenRouter.ai for AI analysis using Meta Llama models. 
                  This data is processed temporarily and not stored by the AI service. No personal information is included.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold mb-2">
                  <i className="fas fa-globe mr-2 text-blue-600"></i>CORS Proxy
                </h3>
                <p className="text-sm text-gray-700">
                  We use AllOrigins service to bypass browser CORS restrictions when accessing Wikipedia. 
                  This is a technical requirement and doesn't involve personal data transmission.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="wiki-section-title">Your Rights & Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-900 mb-3">
                  <i className="fas fa-user-check mr-2"></i>Complete Control
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Export all your data at any time</li>
                  <li>• Delete individual comparisons</li>
                  <li>• Clear all data with one click</li>
                  <li>• No external accounts to manage</li>
                  <li>• Use the service anonymously</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  <i className="fas fa-download mr-2"></i>Data Portability
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Export data in standard JSON format</li>
                  <li>• Copy comparison results to clipboard</li>
                  <li>• No vendor lock-in or data hostage</li>
                  <li>• Transfer data between devices manually</li>
                  <li>• Backup and restore capabilities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section>
            <h2 className="wiki-section-title">GDPR & Legal Compliance</h2>
            <div className="bg-purple-50 border border-purple-200 rounded p-6">
              <h3 className="font-semibold text-purple-900 mb-3">
                <i className="fas fa-balance-scale mr-2"></i>Privacy by Design
              </h3>
              <p className="text-sm text-purple-800 mb-3">
                Wiki Truth is GDPR compliant by design, meaning privacy protection is built into the system architecture:
              </p>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• <strong>Data Minimization:</strong> We collect only what's necessary for functionality</li>
                <li>• <strong>Purpose Limitation:</strong> Data used only for article comparison</li>
                <li>• <strong>Storage Limitation:</strong> No long-term data retention on servers</li>
                <li>• <strong>Transparency:</strong> Open-source code for full auditability</li>
                <li>• <strong>User Control:</strong> Complete ownership of your data</li>
              </ul>
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 className="wiki-section-title">Security Measures</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Technical Security</h3>
                  <ul className="text-sm space-y-1">
                    <li>• HTTPS encryption for all communications</li>
                    <li>• No server-side data storage vulnerabilities</li>
                    <li>• Client-side data encryption in browser</li>
                    <li>• Regular security audits of dependencies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Operational Security</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Minimal attack surface (no user databases)</li>
                    <li>• No payment processing or financial data</li>
                    <li>• Open-source transparency</li>
                    <li>• Privacy-first development practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="wiki-section-title">Questions About Privacy?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
              <p className="text-gray-700 mb-4">
                If you have questions about our privacy practices or want to learn more about how Wiki Truth protects your data:
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setLocation('/about')}
                  className="wiki-button"
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  Learn More About Wiki Truth
                </Button>
                <Button 
                  onClick={() => setLocation('/tools')}
                  className="wiki-button-primary"
                >
                  <i className="fas fa-tools mr-2"></i>
                  Manage Your Data
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}