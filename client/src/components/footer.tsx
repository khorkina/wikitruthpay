import { Link } from "wouter";
import { SuggestImprovement } from "./suggest-improvement";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Wiki Truth</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Privacy-first Wikipedia comparison platform
            </p>
            <SuggestImprovement />
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy policy</Link></li>
              <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help center</Link></li>
              <li><Link href="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">Contact us</Link></li>
              <li><Link href="/report-issues" className="text-muted-foreground hover:text-foreground transition-colors">Report issues</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Technology</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.mediawiki.org/wiki/API:Main_page" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Wikipedia API</a></li>
              <li><a href="https://openai.com/" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">OpenAI GPT-4</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Open source</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Wiki Truth. This site is not affiliated with the Wikimedia Foundation.
          </p>
        </div>
      </div>
    </footer>
  );
}
