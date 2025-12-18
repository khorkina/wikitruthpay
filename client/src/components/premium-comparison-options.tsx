import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface PremiumComparisonOptionsProps {
  selectedLanguages: string[];
  articleTitle: string;
  outputLanguage: string;
  onStartComparison: (options: ComparisonOptions) => void;
  onBack: () => void;
  initialAnalysisMode?: 'academic' | 'biography' | 'funny';
}

export interface ComparisonOptions {
  outputFormat: 'bullet-points' | 'narrative';
  focusPoints: string;
  formality: 'formal' | 'casual' | 'academic';
  aiModel: 'free' | 'premium';
  analysisMode: 'academic' | 'biography' | 'funny';
}

export function PremiumComparisonOptions({ 
  selectedLanguages, 
  articleTitle, 
  outputLanguage, 
  onStartComparison, 
  onBack,
  initialAnalysisMode = 'academic'
}: PremiumComparisonOptionsProps) {
  const [options, setOptions] = useState<ComparisonOptions>({
    outputFormat: 'narrative',
    focusPoints: '',
    formality: initialAnalysisMode === 'funny' ? 'casual' : 'formal',
    aiModel: 'premium',
    analysisMode: initialAnalysisMode
  });

  const handleStartComparison = () => {
    onStartComparison(options);
  };

  const updateOption = <K extends keyof ComparisonOptions>(key: K, value: ComparisonOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm text-green-700 dark:text-green-300 mb-2">
          <Sparkles className="h-4 w-4" />
          Premium Analysis
        </div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          Customize Comparison
        </h2>
        <p className="text-sm text-muted-foreground">
          "{articleTitle}" - {selectedLanguages.length} languages
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Output Format</Label>
            <Select
              value={options.outputFormat}
              onValueChange={(value: 'bullet-points' | 'narrative') => updateOption('outputFormat', value)}
            >
              <SelectTrigger className="text-sm" data-testid="select-output-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrative">Narrative</SelectItem>
                <SelectItem value="bullet-points">Bullet Points</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Analysis Mode</Label>
            <Select
              value={options.analysisMode}
              onValueChange={(value: 'academic' | 'biography' | 'funny') => updateOption('analysisMode', value)}
            >
              <SelectTrigger className="text-sm" data-testid="select-analysis-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="biography">Biography</SelectItem>
                <SelectItem value="funny">Fun Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Formality</Label>
            <Select
              value={options.formality}
              onValueChange={(value: 'formal' | 'casual' | 'academic') => updateOption('formality', value)}
            >
              <SelectTrigger className="text-sm" data-testid="select-formality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Focus Points (Optional)</Label>
          <Textarea
            placeholder="E.g., 'Focus on historical dates', 'Compare cultural perspectives'..."
            value={options.focusPoints}
            onChange={(e) => updateOption('focusPoints', e.target.value)}
            className="min-h-[60px] text-sm resize-none"
            data-testid="input-focus-points"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto" data-testid="button-back">
            Back
          </Button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Output: {outputLanguage}
            </span>
            <Button 
              onClick={handleStartComparison} 
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              data-testid="button-start-premium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Premium Comparison
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
