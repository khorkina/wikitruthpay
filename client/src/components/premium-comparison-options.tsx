import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Settings, Bot, BookOpen, User, Laugh, Zap, FileText } from "lucide-react";

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
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm text-green-700 dark:text-green-300 mb-4">
          <Sparkles className="h-4 w-4" />
          Premium Analysis Options
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customize Your Comparison
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 px-2">
          Configure advanced settings for analyzing "{articleTitle}" across {selectedLanguages.length} languages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Output Format */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
              Output Format
            </CardTitle>
            <CardDescription className="text-sm">Choose how you want the comparison presented</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={options.outputFormat}
              onValueChange={(value: 'bullet-points' | 'narrative') => updateOption('outputFormat', value)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="bullet-points" id="bullet-points" className="mt-1" />
                <Label htmlFor="bullet-points" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium text-sm md:text-base">Bullet Points</div>
                    <div className="text-xs md:text-sm text-gray-500">Structured list of all differences</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="narrative" id="narrative" className="mt-1" />
                <Label htmlFor="narrative" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium text-sm md:text-base">Narrative Analysis</div>
                    <div className="text-xs md:text-sm text-gray-500">Flowing discussion of differences</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Analysis Mode */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
              Analysis Mode
            </CardTitle>
            <CardDescription className="text-sm">Select the type of analysis focus</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={options.analysisMode}
              onValueChange={(value: 'academic' | 'biography' | 'funny') => updateOption('analysisMode', value)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="academic" id="academic" className="mt-1" />
                <Label htmlFor="academic" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm md:text-base">Academic Analysis</div>
                      <div className="text-xs md:text-sm text-gray-500">Scholarly, fact-focused</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="biography" id="biography" className="mt-1" />
                <Label htmlFor="biography" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm md:text-base">Biography Analysis</div>
                      <div className="text-xs md:text-sm text-gray-500">Person-centered, life events</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="funny" id="funny" className="mt-1" />
                <Label htmlFor="funny" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Laugh className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm md:text-base">Fun Mode</div>
                      <div className="text-xs md:text-sm text-gray-500">Humorous, entertaining</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Formality Level */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Settings className="h-4 w-4 md:h-5 md:w-5" />
              Formality Level
            </CardTitle>
            <CardDescription className="text-sm">Set the tone and style of writing</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Select
              value={options.formality}
              onValueChange={(value: 'formal' | 'casual' | 'academic') => updateOption('formality', value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Select formality level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic" className="text-sm md:text-base">Academic - Highly formal, research-style</SelectItem>
                <SelectItem value="formal" className="text-sm md:text-base">Formal - Professional, structured</SelectItem>
                <SelectItem value="casual" className="text-sm md:text-base">Casual - Conversational, approachable</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Focus Points */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Zap className="h-4 w-4 md:h-5 md:w-5" />
            Focus Points (Optional)
          </CardTitle>
          <CardDescription className="text-sm">
            Specify particular aspects, facts, or questions you want the AI to focus on during comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., 'Focus on historical dates and their accuracy', 'Compare cultural perspectives on this person's achievements', 'Look for differences in controversy mentions'..."
            value={options.focusPoints}
            onChange={(e) => updateOption('focusPoints', e.target.value)}
            className="min-h-[80px] md:min-h-[100px] text-sm md:text-base"
          />
          <p className="text-xs text-gray-500 mt-2">
            You can write in any language. The AI will understand your instructions and focus on these areas.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack} className="w-full md:w-auto order-2 md:order-1">
          Back to Language Selection
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 order-1 md:order-2">
          <div className="text-sm text-gray-500 text-center md:text-left">
            Output Language: <span className="font-medium">{outputLanguage}</span>
          </div>
          <Button onClick={handleStartComparison} className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Premium Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}