import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download, Printer, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfServicePage() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = document.getElementById('terms-content')?.innerText || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wiki-truth-terms-of-service.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation and actions */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Wiki Truth
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Service</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Contents</h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-2">
                    <a href="#agreement" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">1. Agreement to Terms</a>
                    <a href="#service" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">2. Service Description</a>
                    <a href="#privacy" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">3. Privacy and Data</a>
                    <a href="#subscription" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">4. Premium Subscription</a>
                    <a href="#use" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">5. Acceptable Use</a>
                    <a href="#intellectual" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">6. Intellectual Property</a>
                    <a href="#warranties" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">7. Disclaimer</a>
                    <a href="#liability" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">8. Limitation of Liability</a>
                    <a href="#changes" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">9. Changes to Terms</a>
                    <a href="#contact" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">10. Contact Information</a>
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-700 dark:text-blue-300 mb-4">
                <ExternalLink className="h-4 w-4" />
                Legal Document
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Last updated: January 2, 2025 • Effective immediately
              </p>
            </div>

            <div id="terms-content" className="space-y-8">
              <Card>
                <CardContent className="p-8 space-y-6">
                  <section id="agreement">
                    <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      By accessing and using Wiki Truth, you accept and agree to be bound by the terms and provision of this agreement. 
                      If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <section id="service">
                    <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      Wiki Truth is a freemium web application that enables users to compare Wikipedia articles across multiple languages using AI analysis:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                      <li><strong>Free Tier:</strong> Unlimited AI-powered comparisons with standard analysis</li>
                      <li><strong>Premium Tier ($5/month):</strong> Enhanced AI analysis with full document processing capabilities</li>
                      <li><strong>Privacy-First:</strong> All user data stored locally in your browser only</li>
                    </ul>
                  </section>

                  <section id="privacy">
                    <h2 className="text-2xl font-semibold mb-3">3. Privacy and Data Storage</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      <strong>Local Data Storage:</strong> All your personal data, comparison history, and preferences are stored exclusively in your browser's local storage. We do not collect, store, or transmit your personal data to our servers.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      <strong>Data Control:</strong> You have complete control over your data. You can export or delete all stored data at any time through the Settings menu.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong>Third-Party APIs:</strong> The service uses Wikipedia API for article content and AI services for analysis. These interactions are processed according to their respective privacy policies.
                    </p>
                  </section>

                  <section id="subscription">
                    <h2 className="text-2xl font-semibold mb-3">4. Premium Subscription</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      Premium subscriptions are processed through NowPayments secure payment system at $10 USD per month:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Subscription automatically renews monthly unless cancelled</li>
                      <li>Subscription status is validated locally in your browser for 30 days</li>
                      <li>No refunds for partial months, but you retain access until expiration</li>
                      <li>You can cancel anytime through your payment provider</li>
                    </ul>
                  </section>

                  <section id="use">
                    <h2 className="text-2xl font-semibold mb-3">5. Acceptable Use</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      You agree to use Wiki Truth responsibly:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Do not use the service for any illegal or unauthorized purpose</li>
                      <li>Do not attempt to reverse engineer or compromise the service</li>
                      <li>Respect Wikipedia's terms of service when accessing their content</li>
                      <li>Do not abuse AI analysis features or attempt to circumvent usage limits</li>
                    </ul>
                  </section>

                  <section id="intellectual">
                    <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Wikipedia content is licensed under Creative Commons. AI-generated analysis is provided for informational purposes. 
                      The Wiki Truth application and its original content are protected by copyright and intellectual property laws.
                    </p>
                  </section>

                  <section id="warranties">
                    <h2 className="text-2xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Wiki Truth is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of AI-generated comparisons. 
                      The service depends on third-party APIs (Wikipedia, AI services) which may experience downtime or changes.
                    </p>
                  </section>

                  <section id="liability">
                    <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      In no event shall Wiki Truth be liable for any indirect, incidental, special, consequential, or punitive damages, 
                      including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                  </section>

                  <section id="changes">
                    <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. 
                      Continued use of the service after changes constitutes acceptance of the new terms.
                    </p>
                  </section>

                  <section id="contact">
                    <h2 className="text-2xl font-semibold mb-3">10. Contact Information</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      For questions about these Terms of Service, please contact us through our Contact Us page or report issues through our Report Issues page.
                    </p>
                  </section>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}