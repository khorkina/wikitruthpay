import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SuggestImprovement() {
  const handleClick = () => {
    const subject = encodeURIComponent('Suggestion for Wiki Truth Improvement');
    const body = encodeURIComponent(`Hello World Truth Foundation team,

I would like to suggest the following improvement for Wiki Truth:

[Please describe your suggestion here]

Thank you for your great work!

Best regards`);
    
    window.location.href = `mailto:worldtruthfoundation@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      data-testid="button-suggest-improvement"
      className="gap-2"
    >
      <Lightbulb className="w-4 h-4" />
      Suggest Improvement
    </Button>
  );
}
