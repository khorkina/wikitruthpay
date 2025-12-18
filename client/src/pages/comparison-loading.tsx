import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Globe, BookOpen, Zap, Clock, Users } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function ComparisonLoading() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Get comparison data from URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const articleTitle = urlParams.get('title') || '';
  const selectedLanguages = JSON.parse(urlParams.get('languages') || '[]');
  const outputLanguage = urlParams.get('outputLanguage') || 'en';
  const isPremium = urlParams.get('isPremium') === 'true';
  const isFunnyMode = urlParams.get('isFunnyMode') === 'true';
  const languageTitles = JSON.parse(urlParams.get('languageTitles') || '{}');
  const premiumOptionsStr = urlParams.get('premiumOptions');
  const premiumOptions = premiumOptionsStr ? JSON.parse(premiumOptionsStr) : undefined;

  const steps = [
    { icon: Globe, text: "Fetching articles from Wikipedia", duration: 15 },
    { icon: BookOpen, text: "Processing article content", duration: 25 },
    { icon: Sparkles, text: `${isPremium ? 'Deep analysis in progress' : 'Analyzing differences'}`, duration: 45 },
    { icon: Zap, text: "Generating insights and findings", duration: 15 }
  ];

  // Comparison mutation
  const comparisonMutation = useMutation({
    mutationFn: () => api.compareArticles({
      articleTitle,
      selectedLanguages,
      outputLanguage,
      isFunnyMode,
      isPremium,
      languageTitles,
      premiumOptions
    }),
    onSuccess: (result) => {
      setProgress(100);
      setTimeout(() => {
        setLocation(`/results/${result.id}`);
      }, 500);
    },
    onError: (error: any) => {
      console.error("Comparison error:", error);

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
        title: "Comparison failed",
        description: error?.message || "Failed to complete the comparison. Please try again.",
        variant: "destructive",
      });

      setLocation("/select-languages");
    },
  });

  // Start comparison when component mounts
  useEffect(() => {
    if (articleTitle && selectedLanguages.length > 0) {
      comparisonMutation.mutate();
    }
  }, []);

  // Progress animation and timer
  useEffect(() => {
    if (comparisonMutation.isPending) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return prev;
          }
          return prev + Math.random() * 1.5;
        });
      }, 1000);

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 4000);

      const timerInterval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
        clearInterval(timerInterval);
      };
    }
  }, [comparisonMutation.isPending]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 lg:py-8 xl:py-12 2xl:py-16">
        <div className="max-w-7xl mx-auto" style={{ maxWidth: '90rem' }}>
          
          <div className="text-center mb-6 lg:mb-8 xl:mb-12 2xl:mb-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4 xl:mb-6 2xl:mb-8">
              Comparing "{articleTitle}"
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl 2xl:max-w-5xl mx-auto">
              Analyzing across {selectedLanguages.length} languages
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
            
            <div className="lg:col-span-8 space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
              <Card className="w-full shadow-lg border overflow-hidden">
                <CardHeader className="pb-3 lg:pb-4 xl:pb-6 2xl:pb-8">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl flex items-center gap-2 lg:gap-3 xl:gap-4">
                    <CurrentIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 text-blue-600 animate-pulse flex-shrink-0" />
                    <span className="truncate">Processing Your Comparison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                  
                  <div className="space-y-3 lg:space-y-4 xl:space-y-6 2xl:space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 xl:gap-4 2xl:gap-6">
                      <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white flex-1 min-w-0">
                        {steps[currentStep].text}
                      </h3>
                      <Badge variant="secondary" className="text-sm lg:text-base xl:text-lg 2xl:text-xl px-2 lg:px-3 xl:px-4 2xl:px-6 py-1 xl:py-2 2xl:py-3 whitespace-nowrap self-start sm:self-auto">
                        {Math.round(progress)}% Complete
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-3 sm:h-4 lg:h-5 xl:h-6 2xl:h-8 w-full" />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-5 lg:p-6 xl:p-8 2xl:p-10">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 mb-2 sm:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 text-blue-600 flex-shrink-0" />
                      <h4 className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-blue-800 dark:text-blue-300">
                        Estimated Processing Time
                      </h4>
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-blue-700 dark:text-blue-200 mb-2 sm:mb-3 xl:mb-4 2xl:mb-6">
                      1-2 minutes
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-blue-600 dark:text-blue-400">
                      {isPremium ? 'Running deep analysis for detailed insights' : 'Processing for comprehensive insights'}
                    </p>
                    {comparisonMutation.isPending && (
                      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                          Analysis in progress... This may take up to 2 minutes for complex comparisons.
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Elapsed time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 w-full">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isActive = index === currentStep;
                      const isCompleted = index < currentStep;
                      
                      return (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-2 sm:p-3 lg:p-4 xl:p-6 2xl:p-8 rounded-lg transition-all duration-300 ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 transform scale-105 shadow-md'
                              : isCompleted
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                          }`}
                        >
                          <StepIcon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 mb-1 sm:mb-2 lg:mb-3 xl:mb-4 2xl:mb-6 flex-shrink-0 ${isActive ? 'animate-bounce' : ''}`} />
                          <span className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl text-center font-medium leading-tight">
                            {step.text.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
              
              <Card className="shadow-lg border h-fit overflow-hidden">
                <CardHeader className="pb-3 lg:pb-4 xl:pb-6 2xl:pb-8">
                  <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl flex items-center gap-2 lg:gap-3 xl:gap-4">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 flex-shrink-0" />
                    <span className="truncate">Languages Compared</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 lg:space-y-3 xl:space-y-4 2xl:space-y-6">
                    {selectedLanguages.map((lang: string) => (
                      <div key={lang} className="flex items-center justify-between p-2 sm:p-3 lg:p-4 xl:p-6 2xl:p-8 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-0">
                        <span className="font-medium text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">
                          {lang.toUpperCase()}
                        </span>
                        <Badge variant="outline" className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl px-2 lg:px-3 xl:px-4 2xl:px-6 py-1 xl:py-2 2xl:py-3 flex-shrink-0">
                          Wikipedia
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isPremium && premiumOptions && (
                <Card className="shadow-lg border h-fit overflow-hidden">
                  <CardHeader className="pb-3 lg:pb-4 xl:pb-6 2xl:pb-8">
                    <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl flex items-center gap-2 lg:gap-3 xl:gap-4">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 flex-shrink-0" />
                      <span className="truncate">Premium Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 lg:space-y-3 xl:space-y-4 2xl:space-y-6">
                    <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl space-y-2 sm:space-y-3 xl:space-y-4 2xl:space-y-6">
                      <div className="flex justify-between items-center min-w-0">
                        <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mr-2 sm:mr-3 xl:mr-4 2xl:mr-6">Format:</span>
                        <span className="font-medium capitalize truncate">{premiumOptions.outputFormat}</span>
                      </div>
                      <div className="flex justify-between items-center min-w-0">
                        <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mr-2 sm:mr-3 xl:mr-4 2xl:mr-6">Style:</span>
                        <span className="font-medium capitalize truncate">{premiumOptions.formality}</span>
                      </div>
                      <div className="flex justify-between items-center min-w-0">
                        <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mr-2 sm:mr-3 xl:mr-4 2xl:mr-6">Mode:</span>
                        <span className="font-medium capitalize truncate">{premiumOptions.analysisMode}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg border bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 h-fit overflow-visible">
                <CardContent className="p-4 sm:p-5 lg:p-6 xl:p-8 2xl:p-10">
                  <div className="text-center">
                    <div 
                      onClick={(e) => {
                        const elem = e.currentTarget;
                        elem.style.animation = 'none';
                        setTimeout(() => {
                          elem.style.animation = 'bounce-planet 0.6s ease-out';
                        }, 10);
                      }}
                      className="inline-block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-2 sm:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8 cursor-pointer transition-transform duration-200 active:scale-90"
                      data-testid="button-planet-animate"
                    >
                      🌍
                    </div>
                    <h3 className="font-bold text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-2 sm:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8 text-gray-900 dark:text-white">
                      Did You Know?
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      Wikipedia articles can vary significantly between languages, 
                      reflecting different cultural perspectives, regional knowledge, 
                      and editorial priorities.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Click the planet above for fun!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}