import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, type LanguageLink } from '@/lib/api';
import { getLanguageName, getLanguageNativeName, SUPPORTED_LANGUAGES, searchLanguages } from '@/lib/languages';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { PremiumComparisonOptions, type ComparisonOptions } from '@/components/premium-comparison-options';

export default function LanguageSelection() {
  const [match, params] = useRoute('/select-languages');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const title = params ? decodeURIComponent(new URLSearchParams(window.location.search).get('title') || '') : '';
  const language = params ? new URLSearchParams(window.location.search).get('lang') || 'en' : 'en';
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([language]);
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  
  // Set output language based on user's browser language preference on component mount
  useEffect(() => {
    const getUserLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      // Check if browser language is supported, otherwise default to English
      const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
      return supportedLang ? browserLang : 'en';
    };
    
    setOutputLanguage(getUserLanguage());
  }, []);
  const [showPremiumOptions, setShowPremiumOptions] = useState(false);
  const [initialAnalysisMode, setInitialAnalysisMode] = useState<'academic' | 'biography' | 'funny'>('academic');

  // Fetch available language links
  const languageLinksQuery = useQuery({
    queryKey: ['/api/wikipedia/languages', title, language],
    queryFn: () => api.getLanguageLinks(title, language),
    enabled: !!title,
  });

  // Comparison mutation supporting both free and premium plans
  const comparisonMutation = useMutation({
    mutationFn: async ({ articleTitle, selectedLanguages, outputLanguage, isFunnyMode, isPremium, premiumOptions }: {
      articleTitle: string;
      selectedLanguages: string[];
      outputLanguage: string;
      isFunnyMode?: boolean;
      isPremium?: boolean;
      premiumOptions?: ComparisonOptions;
    }) => {
      console.log(`Starting ${isPremium ? 'premium' : 'free'} comparison process...`);
      
      // Get language-specific article titles
      const languageTitles: Record<string, string> = {};
      const availableLinks = languageLinksQuery.data || [];
      
      // Add the base language
      languageTitles[language] = title;
      
      // Map selected languages to their article titles
      for (const selectedLang of selectedLanguages) {
        if (selectedLang === language) {
          languageTitles[selectedLang] = title;
        } else {
          const langLink = availableLinks.find(link => link.lang === selectedLang);
          if (langLink) {
            languageTitles[selectedLang] = langLink.title;
          }
        }
      }

      return api.compareArticles({
        articleTitle,
        selectedLanguages,
        outputLanguage,
        baseLanguage: language,
        isFunnyMode,
        languageTitles,
        isPremium
      });
    },
    onSuccess: (result) => {
      // Navigate to results page
      setLocation(`/results/${result.id}`);
    },
    onError: (error: any) => {
      console.error('Comparison error:', error);
      
      // Check for generation limit exceeded error
      if (error?.message === 'GENERATION_LIMIT_EXCEEDED' || error?.requiresSubscription) {
        toast({
          title: "Free generation limit reached",
          description: "You've used your free comparison. Subscribe for unlimited access.",
          variant: "destructive",
        });
        setLocation("/billing");
        return;
      }
      
      toast({
        title: "Comparison Failed",
        description: error?.message || "An error occurred during comparison",
        variant: "destructive"
      });
    }
  });

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        // Don't allow removing the search language (base language)
        if (langCode === language) {
          toast({
            title: "Cannot Remove Search Language",
            description: `${getLanguageName(language)} is the search language and cannot be removed from comparison`,
            variant: "destructive"
          });
          return prev;
        }
        // Remove language if it's not the base language
        return prev.filter(l => l !== langCode);
      } else {
        // Don't allow more than 5 languages
        if (prev.length >= 5) {
          toast({
            title: "Maximum Languages Reached",
            description: "You can select up to 5 languages for comparison",
            variant: "destructive"
          });
          return prev;
        }
        // Add the language
        return [...prev, langCode];
      }
    });
  };

  const handleCompare = async (isFunnyMode: boolean = false) => {
    if (selectedLanguages.length < 2) {
      toast({
        title: "Select More Languages",
        description: "Please select at least 2 languages to compare",
        variant: "destructive"
      });
      return;
    }

    // Set the initial analysis mode based on which button was clicked
    setInitialAnalysisMode(isFunnyMode ? 'funny' : 'academic');
    
    // All users can configure premium comparison settings
    setShowPremiumOptions(true);
    toast({
      title: "Configure Comparison Settings",
      description: "Please configure your comparison options before starting",
      variant: "default"
    });
  };

  const handlePremiumComparisonStart = (options: ComparisonOptions) => {
    setShowPremiumOptions(false);
    
    // Build language titles mapping for premium
    const languageTitles: Record<string, string> = {};
    const availableLinks = languageLinksQuery.data || [];
    
    // Add the base language
    languageTitles[language] = title;
    
    // Map selected languages to their article titles
    for (const selectedLang of selectedLanguages) {
      if (selectedLang === language) {
        languageTitles[selectedLang] = title;
      } else {
        const langLink = availableLinks.find(link => link.lang === selectedLang);
        if (langLink) {
          languageTitles[selectedLang] = langLink.title;
        }
      }
    }
    
    // Navigate to loading page for premium comparison
    const params = new URLSearchParams({
      title,
      languages: JSON.stringify(selectedLanguages),
      outputLanguage,
      isFunnyMode: (options.analysisMode === 'funny').toString(),
      isPremium: (options.aiModel === 'premium').toString(),
      languageTitles: JSON.stringify(languageTitles),
      premiumOptions: JSON.stringify(options)
    });
    setLocation(`/comparison-loading?${params.toString()}`);
  };


  const availableLanguages = languageLinksQuery.data || [];
  
  // Show only languages where the article actually exists
  // Filter available languages to include only those we support
  const filteredAvailableLanguages = availableLanguages.filter(link => 
    SUPPORTED_LANGUAGES.some(lang => lang.code === link.lang)
  );
  
  // Ensure the search language is always included first if not already in the list
  const searchLanguageEntry = {
    lang: language,
    title: title,
    url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title)}`
  };
  
  // Create final list with search language first, then others (excluding duplicates)
  let languagesForDisplay = [searchLanguageEntry];
  
  // Add other available languages, excluding the search language to avoid duplicates
  filteredAvailableLanguages.forEach(lang => {
    if (lang.lang !== language) {
      languagesForDisplay.push(lang);
    }
  });
  
  // Filter languages based on search query
  if (languageSearchQuery.trim()) {
    const searchResults = searchLanguages(languageSearchQuery);
    const searchCodes = searchResults.map(lang => lang.code);
    
    // Keep search language first, then filter others based on search
    languagesForDisplay = [
      searchLanguageEntry,
      ...languagesForDisplay.filter(lang => 
        lang.lang !== language && searchCodes.includes(lang.lang)
      )
    ];
  }
  
  // Final list for rendering
  const supportedAvailableLanguages = languagesForDisplay;

  if (!title) {
    return <div>Loading...</div>;
  }

  // Show comparison options
  if (showPremiumOptions) {
    return (
      <main className="lg:col-span-3">
        <PremiumComparisonOptions
          selectedLanguages={selectedLanguages}
          articleTitle={title}
          outputLanguage={outputLanguage}
          onStartComparison={handlePremiumComparisonStart}
          onBack={() => setShowPremiumOptions(false)}
          initialAnalysisMode={initialAnalysisMode}
        />
      </main>
    );
  }

  return (
    <main className="lg:col-span-3">
      {/* Article Header */}
      <div className="wiki-content-section mb-6">
        <h1 className="wiki-article-title text-2xl font-bold mb-2">{title}</h1>
        <p className="text-wiki-gray mb-4">
          Select languages to compare and analyze cultural perspectives
        </p>
        
        {/* Service Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-blue-800 text-sm">
            <i className="fas fa-check-circle mr-2"></i>
            <strong>Deep Analysis:</strong> Full article processing with advanced comparison
          </p>
          <p className="text-blue-700 text-xs mt-1">
            <i className="fas fa-cog mr-1"></i>
            Click any analysis button below to configure your comparison settings
          </p>
        </div>
      </div>

      {/* Language Selection Section */}
      <div className="wiki-content-section mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="wiki-section-title text-xl font-semibold">
            Select Languages for Comparison
          </h2>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedLanguages.length >= 2 && selectedLanguages.length <= 5 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {selectedLanguages.length}/5 languages selected
            </div>
            <div className="text-xs text-gray-600">
              Choose 2-5 languages to compare
            </div>
          </div>
        </div>
        
        {selectedLanguages.length < 2 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-blue-800 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Getting Started:</strong> Please select at least 2 languages to compare Wikipedia articles and discover cultural differences.
            </p>
          </div>
        )}
        
        {selectedLanguages.length > 5 && (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <p className="text-amber-800 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <strong>Maximum Reached:</strong> Please select no more than 5 languages for optimal comparison quality.
            </p>
          </div>
        )}
        
        {languageLinksQuery.isLoading && (
          <div className="space-y-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-12 rounded"></div>
            ))}
          </div>
        )}
        
        {languageLinksQuery.error && (
          <div className="wiki-message wiki-message-error mb-4">
            Failed to load language options. Please try again.
          </div>
        )}
        
        {supportedAvailableLanguages.length === 0 && !languageLinksQuery.isLoading && !languageLinksQuery.error && (
          <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
            <p className="text-amber-800 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Single Language Article:</strong> This article is only available in {getLanguageName(language)} ({getLanguageNativeName(language)}).
            </p>
            <p className="text-amber-700 text-xs mt-1">
              Wikipedia comparison requires at least 2 different language versions of the same article.
            </p>
          </div>
        )}

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-3">
            <i className="fas fa-info-circle mr-1"></i>
            Showing all language versions where this article exists. Select 2-5 languages to compare different perspectives on the same topic.
          </div>
          
          {/* Language Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a language (e.g., French, Español, Русский)..."
              value={languageSearchQuery}
              onChange={(e) => setLanguageSearchQuery(e.target.value)}
              className="wiki-input pr-10"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            {languageSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguageSearchQuery('')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <i className="fas fa-times text-xs"></i>
              </Button>
            )}
          </div>
          
          {languageSearchQuery && (
            <div className="text-xs text-gray-500 mt-1">
              Showing {supportedAvailableLanguages.length - 1} available languages matching "{languageSearchQuery}"
            </div>
          )}
        </div>

        {supportedAvailableLanguages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {supportedAvailableLanguages.map((link) => {
              const isSearchLanguage = link.lang === language;
              const isSelected = selectedLanguages.includes(link.lang);
              
              return (
                <div 
                  key={link.lang} 
                  className={`wiki-sidebar p-3 flex items-center space-x-3 ${
                    isSearchLanguage ? 'border-2 border-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <Checkbox
                    id={link.lang}
                    checked={isSelected}
                    disabled={isSearchLanguage}
                    onCheckedChange={() => handleLanguageToggle(link.lang)}
                  />
                  <label htmlFor={link.lang} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getLanguageName(link.lang)}</span>
                      {isSearchLanguage && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Search Language
                        </span>
                      )}
                      {!isSearchLanguage && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Article Available
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-wiki-gray">{getLanguageNativeName(link.lang)}</div>
                    {isSearchLanguage && (
                      <div className="text-xs text-blue-600 mt-1">
                        This language is automatically included in your comparison
                      </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Settings */}
      <div className="wiki-content-section mb-6">
        <h2 className="wiki-section-title text-xl font-semibold mb-4">Comparison Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selected Languages ({selectedLanguages.length})
            </label>
            {selectedLanguages.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLanguages.map(lang => (
                  <span key={lang} className="wiki-tag bg-wiki-blue text-white px-2 py-1 rounded text-sm">
                    {getLanguageName(lang)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-wiki-gray text-sm">No languages selected</p>
            )}
            {selectedLanguages.length < 2 && (
              <p className="text-amber-600 text-sm">Select at least 2 languages to compare</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Output Language</label>
            <Select value={outputLanguage} onValueChange={setOutputLanguage}>
              <SelectTrigger className="wiki-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Comparison Actions */}
      <div className="wiki-content-section mb-6">
        <h2 className="wiki-section-title text-xl font-semibold mb-4">Start Analysis</h2>
        
        <div className="space-y-3">
          <Button 
            onClick={() => handleCompare(false)}
            disabled={selectedLanguages.length < 2 || comparisonMutation.isPending}
            className="w-full wiki-button-primary"
          >
            <span>
              <i className="fas fa-search mr-2"></i>
              Academic Analysis
            </span>
          </Button>

          <Button 
            onClick={() => handleCompare(true)}
            disabled={selectedLanguages.length < 2 || comparisonMutation.isPending}
            className="w-full wiki-button-secondary"
          >
            <span>
              <i className="fas fa-smile mr-2"></i>
              Fun Analysis
            </span>
          </Button>
        </div>
      </div>
    </main>
  );
}