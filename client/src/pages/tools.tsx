import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { clientStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { getLanguageName } from '@/lib/languages';

export default function ToolsPage() {
  const { toast } = useToast();

  const comparisonsQuery = useQuery({
    queryKey: ['/api/comparisons'],
    queryFn: () => api.getUserComparisons(),
  });

  const handleExportAll = async () => {
    try {
      const allData = await clientStorage.exportAllData();
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wiki-truth-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "All your data has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export data",
        variant: "destructive"
      });
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all your comparison data? This cannot be undone.')) {
      try {
        await clientStorage.clearAllData();
        comparisonsQuery.refetch();
        toast({
          title: "Data Cleared",
          description: "All comparison data has been deleted",
        });
      } catch (error) {
        toast({
          title: "Clear Failed",
          description: "Could not clear data",
          variant: "destructive"
        });
      }
    }
  };

  const getRandomArticle = () => {
    const topics = [
      'Albert Einstein', 'World War II', 'Climate Change', 'Napoleon Bonaparte',
      'Democracy', 'Artificial Intelligence', 'COVID-19', 'Renaissance',
      'Buddhism', 'Leonardo da Vinci', 'Industrial Revolution', 'Quantum Physics',
      'French Revolution', 'Ancient Rome', 'Socialism', 'Global Warming',
      'Isaac Newton', 'World War I', 'Capitalism', 'Ancient Egypt'
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  };

  return (
    <main className="lg:col-span-3">
      <div className="wiki-content-section">
        <h1 className="wiki-article-title">Tools & Utilities</h1>
        <p className="text-wiki-gray mb-6">
          Manage your comparison data and explore additional features.
        </p>

        <div className="space-y-6">
          {/* Random Article Tool */}
          <div className="bg-gray-50 border border-gray-200 rounded p-6">
            <h2 className="font-semibold text-lg mb-3">
              <i className="fas fa-random mr-2"></i>Random Article Generator
            </h2>
            <p className="text-wiki-gray mb-4">
              Get a random Wikipedia article suggestion for comparison.
            </p>
            <Button 
              onClick={() => {
                const article = getRandomArticle();
                toast({
                  title: "Random Article Suggestion",
                  description: `Try comparing: "${article}"`,
                });
              }}
              className="wiki-button"
            >
              <i className="fas fa-dice mr-2"></i>
              Generate Random Article
            </Button>
          </div>

          {/* Data Management */}
          <div className="bg-gray-50 border border-gray-200 rounded p-6">
            <h2 className="font-semibold text-lg mb-3">
              <i className="fas fa-database mr-2"></i>Data Management
            </h2>
            <p className="text-wiki-gray mb-4">
              Export or clear your comparison history stored locally in your browser.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleExportAll}
                className="wiki-button"
              >
                <i className="fas fa-download mr-2"></i>
                Export All Data
              </Button>
              <Button 
                onClick={handleClearAll}
                className="wiki-button-secondary"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Comparison Statistics */}
          <div className="bg-gray-50 border border-gray-200 rounded p-6">
            <h2 className="font-semibold text-lg mb-3">
              <i className="fas fa-chart-bar mr-2"></i>Your Statistics
            </h2>
            
            {comparisonsQuery.isLoading ? (
              <p className="text-wiki-gray">Loading statistics...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-wiki-blue">
                    {comparisonsQuery.data?.length || 0}
                  </div>
                  <div className="text-sm text-wiki-gray">Total Comparisons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-wiki-blue">
                    {Array.from(new Set(comparisonsQuery.data?.flatMap(c => c.selectedLanguages) || [])).length}
                  </div>
                  <div className="text-sm text-wiki-gray">Languages Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-wiki-blue">
                    {comparisonsQuery.data?.filter(c => c.isFunnyMode).length || 0}
                  </div>
                  <div className="text-sm text-wiki-gray">Fun Mode</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-wiki-blue">
                    {comparisonsQuery.data?.filter(c => !c.isFunnyMode).length || 0}
                  </div>
                  <div className="text-sm text-wiki-gray">Academic</div>
                </div>
              </div>
            )}
          </div>

          {/* Browser Info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>Privacy Notice
            </h3>
            <p className="text-sm text-blue-800">
              All your comparison data is stored locally in your browser using IndexedDB. 
              No data is sent to external servers except for the AI analysis process.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}