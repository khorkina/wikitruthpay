import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, BookOpen, Globe, Calendar } from 'lucide-react';
import { getLanguageName } from '@/lib/languages';

interface LibraryComparison {
  id: number;
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
  comparisonResult: string | null;
  isFunnyMode: boolean | null;
  isPremium: boolean | null;
  createdAt: string | null;
}

interface LibraryResponse {
  comparisons: LibraryComparison[];
  total: number;
  hasMore: boolean;
}

const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'it', label: 'Italian' },
];

export default function LibraryPage() {
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const libraryQuery = useQuery<LibraryResponse>({
    queryKey: ['/api/library', selectedLanguage],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '50' });
      if (selectedLanguage !== 'all') {
        params.set('language', selectedLanguage);
      }
      const response = await fetch(`/api/library?${params}`);
      if (!response.ok) throw new Error('Failed to fetch library');
      return response.json();
    },
  });

  const comparisons = libraryQuery.data?.comparisons || [];
  const currentComparison = comparisons[currentIndex];

  const handleNext = () => {
    if (currentIndex < comparisons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setExpandedCard(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setExpandedCard(null);
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setCurrentIndex(0);
    setExpandedCard(null);
  };

  const toggleExpanded = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Unknown date';
    return new Date(dateStr).toLocaleDateString();
  };

  const getPreviewText = (text: string | null, maxLength: number = 200) => {
    if (!text) return 'No content available';
    const stripped = text.replace(/[#*_`\[\]]/g, '').replace(/\n+/g, ' ').trim();
    return stripped.length > maxLength ? stripped.substring(0, maxLength) + '...' : stripped;
  };

  const getExpandedText = (text: string | null, maxLength: number = 2000) => {
    if (!text) return 'No content available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '\n\n... [Click "View Full Analysis" to see the complete comparison]';
  };

  return (
    <main className="container mx-auto max-w-4xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="px-4 md:px-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-library-title">Library</h1>
            <p className="text-muted-foreground text-sm">Browse public comparisons from the community</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Filter by output language:</label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full md:w-64" data-testid="select-language-filter">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {libraryQuery.isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading library...</p>
          </div>
        )}

        {libraryQuery.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-destructive">Failed to load library. Please try again.</p>
          </div>
        )}

        {!libraryQuery.isLoading && comparisons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Comparisons Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The library is empty for this language. Be the first to create a comparison!
            </p>
            <Button onClick={() => setLocation('/search')} data-testid="button-start-comparison">
              Create First Comparison
            </Button>
          </div>
        )}

        {!libraryQuery.isLoading && comparisons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{currentIndex + 1} of {comparisons.length} comparisons</span>
              <span>{libraryQuery.data?.total || 0} total</span>
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 rounded-full"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                data-testid="button-previous"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>

              {currentComparison && (
                <Card 
                  className="cursor-pointer transition-all duration-200 mt-8 mb-8"
                  onClick={() => toggleExpanded(currentComparison.id)}
                  data-testid={`card-comparison-${currentComparison.id}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg md:text-xl" data-testid="text-article-title">
                      {currentComparison.articleTitle}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>
                          {currentComparison.selectedLanguages?.map(l => getLanguageName(l)).join(', ') || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(currentComparison.createdAt)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {expandedCard === currentComparison.id ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto">
                        <div className="whitespace-pre-wrap text-sm" data-testid="text-full-content">
                          {getExpandedText(currentComparison.comparisonResult)}
                        </div>
                        <div className="mt-4 pt-4 border-t flex gap-2 sticky bottom-0 bg-card pb-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`/results/${currentComparison.id}?source=library`);
                            }}
                            data-testid="button-view-full"
                          >
                            View Full Analysis
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(null);
                            }}
                            data-testid="button-collapse"
                          >
                            Collapse
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted-foreground text-sm" data-testid="text-preview">
                          {getPreviewText(currentComparison.comparisonResult)}
                        </p>
                        <p className="text-primary text-sm mt-2 font-medium">
                          Tap to read more
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 rounded-full"
                onClick={handleNext}
                disabled={currentIndex >= comparisons.length - 1}
                data-testid="button-next"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center gap-1 mt-8">
              {comparisons.slice(Math.max(0, currentIndex - 2), Math.min(comparisons.length, currentIndex + 3)).map((_, idx) => {
                const actualIndex = Math.max(0, currentIndex - 2) + idx;
                return (
                  <button
                    key={actualIndex}
                    className={`w-2 h-2 rounded-full transition-all ${
                      actualIndex === currentIndex 
                        ? 'bg-primary w-4' 
                        : 'bg-muted-foreground/30'
                    }`}
                    onClick={() => {
                      setCurrentIndex(actualIndex);
                      setExpandedCard(null);
                    }}
                    data-testid={`button-dot-${actualIndex}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
