import { useState } from 'react';
import { useLocation } from 'wouter';
import { SearchInterface } from '@/components/search-interface';
import { SearchResult } from '@/lib/api';

export default function SearchPage() {
  const [, setLocation] = useLocation();

  const handleArticleSelected = (article: SearchResult, language: string) => {
    setLocation(`/select-languages?title=${encodeURIComponent(article.title)}&lang=${language}`);
  };

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        <h1 className="wiki-article-title">Search Wikipedia Articles</h1>
        <p className="text-wiki-gray mb-4">
          Search for any Wikipedia article to start comparing across different languages and cultures.
        </p>
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-6">
          <p className="text-sm text-green-800">
            <i className="fas fa-filter mr-2"></i>
            Only articles available in multiple languages are shown. This ensures you can compare different cultural perspectives.
          </p>
        </div>

        <SearchInterface onArticleSelected={handleArticleSelected} />

        {/* Search Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            <i className="fas fa-lightbulb mr-2"></i>Search Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Try searching for people, places, events, or concepts</li>
            <li>• Use specific names rather than general terms</li>
            <li>• Historical figures and countries often have rich cross-cultural perspectives</li>
            <li>• Scientific topics may show different emphasis across languages</li>
            <li>• All results are pre-filtered to include only articles available in multiple languages</li>
          </ul>
        </div>

        {/* Popular Topics */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Popular Comparison Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Albert Einstein', 'World War II', 'Climate Change',
              'Napoleon Bonaparte', 'Democracy', 'Artificial Intelligence',
              'COVID-19', 'Renaissance', 'Buddhism'
            ].map(topic => (
              <button
                key={topic}
                onClick={() => {
                  // Simulate selecting this topic for search
                  const searchEvent = new CustomEvent('wikiSearch', { detail: topic });
                  window.dispatchEvent(searchEvent);
                }}
                className="wiki-button text-left text-sm hover:bg-blue-50"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}