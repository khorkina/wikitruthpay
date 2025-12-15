import { useState } from 'react';
import { useLocation } from 'wouter';
import { SearchInterface } from '@/components/search-interface';
import { SearchResult } from '@/lib/api';

export default function Home() {
  const [, setLocation] = useLocation();

  const handleArticleSelected = (article: SearchResult, language: string) => {
    // Navigate to language selection page with article data
    setLocation(`/select-languages?title=${encodeURIComponent(article.title)}&lang=${language}`);
  };

  return (
    <main className="lg:col-span-3">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="font-bold text-4xl mb-4">Wiki Truth</h1>
          <p className="text-lg text-wiki-gray mb-6 max-w-3xl mx-auto">
            Wiki Truth uses artificial intelligence to compare Wikipedia articles across multiple languages. 
            It reveals how the same topic can be presented differently in various linguistic and cultural contexts.
          </p>
        </div>

        {/* Search Interface */}
        <SearchInterface onArticleSelected={handleArticleSelected} />

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="wiki-sidebar">
            <div className="text-center mb-4">
              <i className="fas fa-globe text-3xl text-wiki-blue mb-2"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">Multi-Language Analysis</h3>
            <p className="text-sm text-wiki-gray">
              Compare the same topic across 2-5 different Wikipedia language versions to discover cultural perspectives.
            </p>
          </div>
          
          <div className="wiki-sidebar">
            <div className="text-center mb-4">
              <i className="fas fa-brain text-3xl text-wiki-blue mb-2"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-wiki-gray">
              Uses GPT-4 to identify factual differences, narrative variations, and cultural biases in content presentation.
            </p>
          </div>
          
          <div className="wiki-sidebar">
            <div className="text-center mb-4">
              <i className="fas fa-share-alt text-3xl text-wiki-blue mb-2"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">Export & Share</h3>
            <p className="text-sm text-wiki-gray">
              Export comparisons as Word documents or share insights across social platforms.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
