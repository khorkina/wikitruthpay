import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, Eye, Download, Share } from 'lucide-react';
import { clientStorage } from '@/lib/storage';
import { type ComparisonResult } from '@/lib/api';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export function HistoryDialog() {
  const [open, setOpen] = useState(false);
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadComparisons();
    }
  }, [open]);

  const loadComparisons = async () => {
    setLoading(true);
    try {
      const userComparisons = await api.getUserComparisons();
      setComparisons(userComparisons);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comparison history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    setOpen(false);
    setLocation(`/comparison/${id}`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete comparison for "${title}"?`)) return;

    try {
      await api.deleteComparison(id);
      setComparisons(prev => prev.filter(comp => comp.id !== id));
      toast({
        title: "Deleted",
        description: "Comparison removed from history"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comparison",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (id: string, title: string) => {
    try {
      const blob = await api.exportComparison(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wiki-truth-${title.replace(/[^a-zA-Z0-9]/g, '_')}-comparison.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exported",
        description: "Comparison downloaded as text file"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export comparison",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (id: string, platform: string = 'twitter') => {
    try {
      const shareUrl = await api.shareComparison(id, platform);
      window.open(shareUrl, '_blank');
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to create share link",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Comparison History</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading your comparisons...
            </div>
          ) : comparisons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comparisons yet</p>
              <p className="text-sm">Start by searching for a Wikipedia article</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comparisons.map((comparison) => (
                <div key={comparison.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{comparison.articleTitle}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {comparison.selectedLanguages.map(lang => (
                          <Badge key={lang} variant="secondary">{lang}</Badge>
                        ))}
                        <Badge variant="outline">Output: {comparison.outputLanguage}</Badge>
                        {comparison.isFunnyMode && (
                          <Badge variant="default">Funny Mode</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Created: {new Date(comparison.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {comparison.articles.length} articles compared
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(comparison.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(comparison.id, comparison.articleTitle)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(comparison.id)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(comparison.id, comparison.articleTitle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {comparison.comparisonResult && (
                    <>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <p className="font-medium mb-2">Preview:</p>
                        <p className="text-muted-foreground line-clamp-3">
                          {comparison.comparisonResult.slice(0, 200)}...
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {comparisons.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {comparisons.length} comparison{comparisons.length !== 1 ? 's' : ''} stored locally
            </p>
            <Button onClick={loadComparisons} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}