import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { SearchInterface } from '@/components/search-interface';
import { SearchResult } from '@/lib/api';

export default function MainPage() {
  const [, setLocation] = useLocation();

  const handleArticleSelected = (article: SearchResult, language: string) => {
    setLocation(`/select-languages?title=${encodeURIComponent(article.title)}&lang=${language}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Wiki Truth
          </h1>
          <p className="text-lg md:text-xl text-wiki-gray max-w-4xl mx-auto leading-relaxed">
            Discover how the same topic is presented differently across Wikipedia's language versions. 
            Our AI-powered analysis reveals cultural perspectives, factual variations, and narrative differences.
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-3xl mx-auto">
          <SearchInterface onArticleSelected={handleArticleSelected} />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="wiki-card text-center">
          <div className="w-12 h-12 bg-wiki-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-wiki-blue" />
          </div>
          <h3 className="font-bold text-lg mb-3">Multi-Language Analysis</h3>
          <p className="text-sm text-wiki-gray leading-relaxed">
            Compare articles across 2-5 Wikipedia languages from 270+ available languages to discover cultural perspectives.
          </p>
        </div>
        
        <div className="wiki-card text-center">
          <div className="w-12 h-12 bg-wiki-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-wiki-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-3">AI-Powered Insights</h3>
          <p className="text-sm text-wiki-gray leading-relaxed">
            Uses advanced AI to identify factual differences, narrative variations, and cultural biases in content presentation.
          </p>
        </div>
        
        <div className="wiki-card text-center md:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-wiki-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-wiki-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-3">Privacy First</h3>
          <p className="text-sm text-wiki-gray leading-relaxed">
            All data stored locally in your browser. No account required, completely free to use.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-sm text-wiki-gray">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>35+ Languages Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Unlimited Comparisons</span>
          </div>
        </div>
      </section>
    </div>
  );
}