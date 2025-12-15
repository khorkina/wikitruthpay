import { Link } from "wouter";
import { PremiumIndicator } from "./premium-indicator";

export function Sidebar() {
  return (
    <aside className="lg:col-span-1">
      <div className="wiki-sidebar mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Navigation</h3>
          <PremiumIndicator />
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/" className="wiki-link">Main page</Link></li>
          <li><Link href="/search" className="wiki-link">Search articles</Link></li>
          <li><Link href="/compare" className="wiki-link">Compare</Link></li>
        </ul>
      </div>
      
      <div className="wiki-sidebar mb-6">
        <h3 className="font-bold text-lg mb-3">Tools</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/tools" className="wiki-link">Random article</Link></li>
          <li><Link href="/recent" className="wiki-link">Recent comparisons</Link></li>
        </ul>
      </div>

      <div className="wiki-sidebar">
        <h3 className="font-bold text-lg mb-3">Help</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/about" className="wiki-link">About</Link></li>
          <li><Link href="/how-it-works" className="wiki-link">How it works</Link></li>
          <li><Link href="/help" className="wiki-link">Help</Link></li>
          <li><Link href="/privacy" className="wiki-link">Privacy</Link></li>
        </ul>
      </div>
    </aside>
  );
}
