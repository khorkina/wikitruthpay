import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, History, HelpCircle, Info, Settings } from 'lucide-react';
import { SettingsDialog } from './settings-dialog';
import { ThemeToggle } from './theme-toggle';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  section: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Main page', icon: <Search className="w-4 h-4" />, section: 'Primary' },
  { href: '/search', label: 'Search articles', icon: <Search className="w-4 h-4" />, section: 'Primary' },
  { href: '/recent', label: 'Recent comparisons', icon: <History className="w-4 h-4" />, section: 'Tools' },
  { href: '/about', label: 'About', icon: <Info className="w-4 h-4" />, section: 'Help' },
  { href: '/how-it-works', label: 'How it works', icon: <Info className="w-4 h-4" />, section: 'Help' },
  { href: '/privacy', label: 'Privacy', icon: <Info className="w-4 h-4" />, section: 'Help' },
];

export function ResponsiveNav() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const groupedItems = NAV_ITEMS.reduce((groups, item) => {
    if (!groups[item.section]) {
      groups[item.section] = [];
    }
    groups[item.section].push(item);
    return groups;
  }, {} as Record<string, NavItem[]>);

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-30 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">
                  <Link href="/" className="text-foreground hover:text-primary">
                    Wiki Truth
                  </Link>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <SettingsDialog />
              </div>
            </div>
          </header>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-nav-overlay" onClick={toggleMobileMenu} />
          )}

          {/* Mobile Menu Panel */}
          <nav className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : 'closed'}`}>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {Object.entries(groupedItems).map(([section, items]) => (
                <div key={section}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">{section}</h3>
                  <div className="space-y-1">
                    {items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`wiki-nav-link ${location === item.href ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          // Close menu with animation
                          setIsMobileMenuOpen(false);
                          // Navigate after animation completes
                          setTimeout(() => {
                            // Use wouter's navigation
                            const link = document.createElement('a');
                            link.href = item.href;
                            link.click();
                          }, 200);
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Mobile Bottom Navigation */}
          <div className="mobile-bottom-nav">
            <div className="flex items-center justify-around">
              <Link 
                href="/" 
                className="flex flex-col items-center gap-1 py-2 px-3 text-xs"
                onClick={() => {
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
                }}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
              <Link 
                href="/recent" 
                className="flex flex-col items-center gap-1 py-2 px-3 text-xs"
                onClick={() => {
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
                }}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              <Link 
                href="/about" 
                className="flex flex-col items-center gap-1 py-2 px-3 text-xs"
                onClick={() => {
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
                }}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>

            </div>
          </div>
        </>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <>
          {/* Desktop Header */}
          <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-30 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">
                  <Link href="/" className="text-foreground hover:text-primary">
                    Wiki Truth
                  </Link>
                </h1>
                <span className="text-sm text-muted-foreground">Privacy-first comparison</span>
              </div>
              <div className="flex items-center gap-6">
                <nav className="flex items-center gap-6">
                  <Link href="/search" className="wiki-link text-sm">Search</Link>
                  <Link href="/recent" className="wiki-link text-sm">History</Link>
                  <Link href="/help" className="wiki-link text-sm">Help</Link>
                  <Link href="/about" className="wiki-link text-sm">About</Link>
                </nav>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <SettingsDialog />
                </div>
              </div>
            </div>
          </header>

          {/* Desktop Sidebar */}
          <aside className="desktop-sidebar pt-20">
            <div className="p-6 space-y-6">
              {Object.entries(groupedItems).map(([section, items]) => (
                <div key={section}>
                  <h3 className="text-sm font-medium text-wiki-gray mb-3">{section}</h3>
                  <div className="space-y-1">
                    {items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`wiki-nav-link ${location === item.href ? 'active' : ''}`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </>
  );
}