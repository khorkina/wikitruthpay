import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Settings, Download, Trash2 } from 'lucide-react';
import { clientStorage, type UserAccount } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [exportData, setExportData] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  const loadUserData = async () => {
    try {
      const userData = await clientStorage.getCurrentUser();
      setUser(userData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user settings",
        variant: "destructive"
      });
    }
  };

  const exportAllData = async () => {
    try {
      const data = await clientStorage.exportAllData();
      const jsonData = JSON.stringify(data, null, 2);
      setExportData(jsonData);
      
      toast({
        title: "Data Exported",
        description: "Your data has been exported. You can copy and save it."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data",
        variant: "destructive"
      });
    }
  };

  const downloadExportData = () => {
    if (!exportData) return;
    
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wikitruth-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your data export has been downloaded"
    });
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      return;
    }

    try {
      await clientStorage.clearAllData();
      setUser(null);
      setExportData('');
      
      toast({
        title: "Data Cleared",
        description: "All your data has been deleted from this browser"
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear your data",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings & Data Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          {user && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p><strong>Default Language:</strong> {user.preferences.defaultLanguage}</p>
                <p><strong>Theme:</strong> {user.preferences.theme}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Data Export */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Your Data
            </h3>
            <p className="text-sm text-gray-600">
              Export all your comparison history and settings as JSON data.
            </p>
            <div className="flex gap-3">
              <Button onClick={exportAllData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate Export
              </Button>
              {exportData && (
                <Button onClick={downloadExportData}>
                  Download JSON File
                </Button>
              )}
            </div>
            
            {exportData && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Exported Data (JSON):
                </label>
                <Textarea
                  value={exportData}
                  readOnly
                  className="font-mono text-xs h-32"
                  placeholder="Click 'Generate Export' to see your data here"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </h3>
            <p className="text-sm text-gray-600">
              Permanently delete all your data from this browser. This action cannot be undone.
            </p>
            <Button 
              onClick={clearAllData}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}