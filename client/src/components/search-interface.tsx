import { useState } from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWikipediaSearch } from '@/hooks/use-wikipedia-search';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { SearchResult } from '@/lib/api';

interface SearchInterfaceProps {
  onArticleSelected: (article: SearchResult, language: string) => void;
}

export function SearchInterface({ onArticleSelected }: SearchInterfaceProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { query, search, suggestions, isLoading } = useWikipediaSearch(selectedLanguage);

  const handleInputChange = (value: string) => {
    search(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    onArticleSelected(suggestion, selectedLanguage);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = () => {
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="wiki-content-section mb-8">
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Select input language:</label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="wiki-input">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative mb-6">
        <label className="block text-sm font-semibold mb-2">Search for an article:</label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Type to search Wikipedia articles..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="wiki-search-input pr-12"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b shadow-lg z-10 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-2"></div>
                Finding quality articles...
              </div>
            ) : suggestions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="mb-2">No articles found for "{query}"</div>
                <div className="text-xs text-gray-400">
                  Try different keywords or check spelling
                </div>
              </div>
            ) : (
              <>
                <div className="p-2 bg-green-50 border-b border-green-200 text-xs text-green-700">
                  <i className="fas fa-check-circle mr-1"></i>
                  {suggestions.length} quality articles found with multiple language versions
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.pageid}-${index}`}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1 flex items-center">
                          <span className="text-xs text-gray-400 mr-2 bg-gray-100 px-1.5 py-0.5 rounded">#{index + 1}</span>
                          {suggestion.title}
                        </div>
                        {suggestion.snippet && (
                          <div className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {suggestion.snippet}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 text-xs text-gray-400">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-2 bg-blue-50 border-t border-blue-200 text-xs text-blue-700 text-center">
                  Click any article above to start comparing across languages
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={handleSearchSubmit} 
        className="wiki-button-modern w-full"
        disabled={suggestions.length === 0}
      >
        <Search className="w-4 h-4 mr-2" />
        Search Article
      </Button>
    </div>
  );
}
