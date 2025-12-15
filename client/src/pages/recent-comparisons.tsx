import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getLanguageName } from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';

export default function RecentComparisonsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const comparisonsQuery = useQuery({
    queryKey: ['/api/comparisons'],
    queryFn: () => api.getUserComparisons(),
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this comparison?')) {
      try {
        await api.deleteComparison(id);
        comparisonsQuery.refetch();
        toast({
          title: "Comparison Deleted",
          description: "The comparison has been removed from your history",
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Could not delete the comparison",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <main className="container mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-8">
      <div className="wiki-content-section px-4 md:px-6">
        <h1 className="wiki-article-title text-xl md:text-2xl">Recent Comparisons</h1>
        <p className="text-wiki-gray mb-4 md:mb-6 text-sm md:text-base">
          View and manage your comparison history stored locally in your browser.
        </p>

        {comparisonsQuery.isLoading && (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-wiki-gray mb-2"></i>
            <p className="text-wiki-gray">Loading your comparisons...</p>
          </div>
        )}

        {comparisonsQuery.error && (
          <div className="wiki-message wiki-message-error">
            Failed to load comparison history. Please try refreshing the page.
          </div>
        )}

        {comparisonsQuery.data && comparisonsQuery.data.length === 0 && (
          <div className="text-center py-8 md:py-12 px-4">
            <i className="fas fa-history text-3xl md:text-4xl text-wiki-gray mb-3 md:mb-4"></i>
            <h2 className="text-lg md:text-xl font-semibold mb-2">No Comparisons Yet</h2>
            <p className="text-wiki-gray mb-4 md:mb-6 text-sm md:text-base max-w-md mx-auto">
              You haven't created any comparisons yet. Start by searching for a Wikipedia article.
            </p>
            <Button 
              onClick={() => setLocation('/search')}
              className="wiki-button-primary text-sm md:text-base"
            >
              <i className="fas fa-search mr-2"></i>
              Start Your First Comparison
            </Button>
          </div>
        )}

        {comparisonsQuery.data && comparisonsQuery.data.length > 0 && (
          <div className="space-y-4">
            {comparisonsQuery.data
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comparison) => (
                <div key={comparison.id} className="wiki-sidebar p-3 md:p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base md:text-lg mb-2 break-words">
                        {comparison.articleTitle}
                      </h3>
                      <div className="text-xs md:text-sm text-wiki-gray space-y-1">
                        <div className="flex items-start gap-2">
                          <i className="fas fa-globe mt-0.5 flex-shrink-0"></i>
                          <span className="break-words">
                            Languages: {comparison.selectedLanguages.map(lang => getLanguageName(lang)).join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-calendar flex-shrink-0"></i>
                          <span className="truncate">
                            {new Date(comparison.createdAt).toLocaleDateString()}
                            <span className="hidden sm:inline"> at {new Date(comparison.createdAt).toLocaleTimeString()}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`fas ${comparison.isFunnyMode ? 'fa-smile' : 'fa-graduation-cap'} flex-shrink-0`}></i>
                          <span>{comparison.isFunnyMode ? 'Fun Mode' : 'Academic Analysis'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:ml-4 w-full md:w-auto">
                      <Button
                        onClick={() => setLocation(`/results/${comparison.id}`)}
                        className="wiki-button text-xs md:text-sm flex-1 md:flex-none"
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View
                      </Button>
                      <Button
                        onClick={() => handleDelete(comparison.id)}
                        className="wiki-button-secondary text-xs md:text-sm flex-1 md:flex-none"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview of comparison result */}
                  <div className="text-xs md:text-sm text-gray-600 bg-gray-50 p-2 md:p-3 rounded break-words">
                    {comparison.comparisonResult.substring(0, 150)}
                    {comparison.comparisonResult.length > 150 && '...'}
                  </div>
                </div>
              ))}

            {/* Summary Statistics */}
            <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-900 mb-3 text-sm md:text-base">
                <i className="fas fa-chart-pie mr-2"></i>Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 text-xs md:text-sm">
                <div className="text-center md:text-left">
                  <div className="font-medium text-blue-900">Total</div>
                  <div className="text-blue-800 font-semibold text-lg md:text-xl">{comparisonsQuery.data.length}</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-medium text-blue-900">Academic</div>
                  <div className="text-blue-800 font-semibold text-lg md:text-xl">{comparisonsQuery.data.filter(c => !c.isFunnyMode).length}</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-medium text-blue-900">Fun Mode</div>
                  <div className="text-blue-800 font-semibold text-lg md:text-xl">{comparisonsQuery.data.filter(c => c.isFunnyMode).length}</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-medium text-blue-900">Languages</div>
                  <div className="text-blue-800 font-semibold text-lg md:text-xl">{Array.from(new Set(comparisonsQuery.data.flatMap(c => c.selectedLanguages))).length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}