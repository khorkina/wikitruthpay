import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const [, setLocation] = useLocation();

  return (
    <main className="container mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="wiki-content-section px-4 md:px-6">
        <h1 className="wiki-article-title">About Wiki Truth</h1>
        <p className="text-wiki-gray mb-6">
          Discover cultural perspectives and narrative differences across Wikipedia's language versions.
        </p>

        <div className="space-y-8">
          {/* Mission */}
          <section>
            <h2 className="wiki-section-title">Our Mission</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Wiki Truth reveals how the same topic can be presented differently across Wikipedia's various language versions. 
                By comparing articles side-by-side with AI-powered analysis, we uncover cultural biases, narrative variations, 
                and factual differences that reflect diverse global perspectives.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our platform serves researchers, students, journalists, and curious minds who want to understand how culture 
                influences the presentation of information and discover the rich diversity of human knowledge.
              </p>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="wiki-section-title">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  <i className="fas fa-brain mr-2"></i>AI-Powered Analysis
                </h3>
                <p className="text-sm text-blue-800">
                  Advanced language models analyze content differences, cultural perspectives, and narrative variations 
                  across Wikipedia articles in different languages.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-6">
                <h3 className="font-semibold text-green-900 mb-3">
                  <i className="fas fa-shield-alt mr-2"></i>Privacy First
                </h3>
                <p className="text-sm text-green-800">
                  All data stored locally in your browser. No accounts, no tracking, no server-side data storage. 
                  You maintain complete control over your information.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-6">
                <h3 className="font-semibold text-purple-900 mb-3">
                  <i className="fas fa-globe mr-2"></i>35+ Languages
                </h3>
                <p className="text-sm text-purple-800">
                  Compare articles across major world languages including English, Spanish, French, German, 
                  Russian, Chinese, Arabic, Japanese, and many more.
                </p>
              </div>


            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="wiki-section-title">How It Works</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-wiki-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <p className="text-sm text-gray-600">Find any Wikipedia article in your preferred language</p>
                </div>
                <div className="text-center">
                  <div className="bg-wiki-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                  <h3 className="font-semibold mb-2">Select</h3>
                  <p className="text-sm text-gray-600">Choose 2-5 language versions to compare</p>
                </div>
                <div className="text-center">
                  <div className="bg-wiki-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                  <h3 className="font-semibold mb-2">Analyze</h3>
                  <p className="text-sm text-gray-600">AI processes articles and identifies differences</p>
                </div>
                <div className="text-center">
                  <div className="bg-wiki-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                  <h3 className="font-semibold mb-2">Discover</h3>
                  <p className="text-sm text-gray-600">Review cultural insights and perspective differences</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section>
            <h2 className="wiki-section-title">Technology</h2>
            <div className="bg-gray-50 border border-gray-200 rounded p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Open Source & Transparent</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Wiki Truth is built with modern web technologies and open-source principles:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• React & TypeScript frontend</li>
                    <li>• Privacy-first architecture</li>
                    <li>• Direct Wikipedia API integration</li>
                    <li>• Meta Llama AI models via OpenRouter</li>
                    <li>• Local browser storage (IndexedDB)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Privacy & Security</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Your privacy is our top priority:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• No user accounts or registration</li>
                    <li>• No server-side data storage</li>
                    <li>• No tracking or analytics</li>
                    <li>• GDPR compliant by design</li>
                    <li>• Complete data portability</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="wiki-section-title">Perfect For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="wiki-sidebar">
                <h3 className="font-semibold mb-2">
                  <i className="fas fa-graduation-cap mr-2 text-wiki-blue"></i>Researchers & Students
                </h3>
                <p className="text-sm text-gray-600">
                  Understand cultural biases in information presentation and discover diverse perspectives on academic topics.
                </p>
              </div>
              <div className="wiki-sidebar">
                <h3 className="font-semibold mb-2">
                  <i className="fas fa-newspaper mr-2 text-wiki-blue"></i>Journalists & Writers
                </h3>
                <p className="text-sm text-gray-600">
                  Uncover different cultural framings of current events and historical narratives for richer storytelling.
                </p>
              </div>
              <div className="wiki-sidebar">
                <h3 className="font-semibold mb-2">
                  <i className="fas fa-globe-americas mr-2 text-wiki-blue"></i>Cultural Enthusiasts
                </h3>
                <p className="text-sm text-gray-600">
                  Explore how different cultures perceive and present the same topics, from history to science to politics.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section>
            <div className="bg-wiki-blue text-white rounded p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Exploring Cultural Perspectives</h2>
              <p className="mb-6 opacity-90">
                Discover how the same topic is presented differently across Wikipedia's global community.
              </p>
              <Button 
                onClick={() => setLocation('/search')}
                className="bg-white text-wiki-blue hover:bg-gray-100 font-semibold px-8 py-3"
              >
                <i className="fas fa-search mr-2"></i>
                Begin Your First Comparison
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}