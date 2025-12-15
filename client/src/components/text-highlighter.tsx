import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Highlighter, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientStorage, type LocalHighlight } from '@/lib/storage';

interface TextHighlighterProps {
  content: string;
  comparisonId: string | number;
  formatContent: (content: string) => string;
}

const HIGHLIGHT_COLORS = [
  { name: 'yellow', bg: 'bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-yellow-100', class: 'rgba(254, 240, 138, 0.7)' },
  { name: 'green', bg: 'bg-green-200 dark:bg-green-900/50 text-gray-900 dark:text-green-100', class: 'rgba(187, 247, 208, 0.7)' },
  { name: 'blue', bg: 'bg-blue-200 dark:bg-blue-900/50 text-gray-900 dark:text-blue-100', class: 'rgba(191, 219, 254, 0.7)' },
  { name: 'pink', bg: 'bg-pink-200 dark:bg-pink-900/50 text-gray-900 dark:text-pink-100', class: 'rgba(251, 207, 232, 0.7)' },
  { name: 'orange', bg: 'bg-orange-200 dark:bg-orange-900/50 text-gray-900 dark:text-orange-100', class: 'rgba(254, 215, 170, 0.7)' },
];

function getColorBg(colorName: string): string {
  const color = HIGHLIGHT_COLORS.find(c => c.name === colorName);
  return color ? color.bg : 'bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-yellow-100';
}

export function TextHighlighter({ content, comparisonId, formatContent }: TextHighlighterProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const comparisonIdStr = String(comparisonId);

  const { data: highlights = [] } = useQuery<LocalHighlight[]>({
    queryKey: ['highlights', comparisonIdStr],
    queryFn: async () => {
      return clientStorage.getHighlightsByComparisonId(comparisonIdStr);
    },
    enabled: !!comparisonId,
  });

  const createHighlightMutation = useMutation({
    mutationFn: async (data: { startOffset: number; endOffset: number; color: string; excerpt: string }) => {
      return clientStorage.saveHighlight({
        comparisonId: comparisonIdStr,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights', comparisonIdStr] });
      toast({
        title: 'Highlight saved',
        description: 'Your highlight has been saved.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save highlight.',
        variant: 'destructive',
      });
    },
  });

  const deleteHighlightMutation = useMutation({
    mutationFn: async (highlightId: string) => {
      return clientStorage.deleteHighlight(highlightId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights', comparisonIdStr] });
      toast({
        title: 'Highlight removed',
        description: 'Your highlight has been removed.',
      });
    },
  });

  const getTextOffset = useCallback((container: Node, targetNode: Node, targetOffset: number): number => {
    let offset = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node === targetNode) {
        return offset + targetOffset;
      }
      offset += node.textContent?.length || 0;
    }
    return offset;
  }, []);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) {
      setShowColorPicker(false);
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 2) {
      setShowColorPicker(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const container = contentRef.current;
    
    if (!container.contains(range.commonAncestorContainer)) {
      setShowColorPicker(false);
      return;
    }

    const formattedContent = container.querySelector('.formatted-content');
    if (!formattedContent) {
      setShowColorPicker(false);
      return;
    }

    const startOffset = getTextOffset(formattedContent, range.startContainer, range.startOffset);
    const endOffset = getTextOffset(formattedContent, range.endContainer, range.endOffset);

    if (startOffset === endOffset) {
      setShowColorPicker(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    setSelectedText(text);
    setSelectionRange({ start: startOffset, end: endOffset });
    setColorPickerPosition({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
    });
    setShowColorPicker(true);
  }, [getTextOffset]);

  const handleColorSelect = (color: string) => {
    if (!selectionRange || !selectedText) return;

    createHighlightMutation.mutate({
      startOffset: selectionRange.start,
      endOffset: selectionRange.end,
      color,
      excerpt: selectedText.substring(0, 100),
    });

    setShowColorPicker(false);
    setSelectedText('');
    setSelectionRange(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteHighlight = (highlightId: string) => {
    deleteHighlightMutation.mutate(highlightId);
  };

  const renderContentWithHighlights = () => {
    // First, format the content to HTML
    const formattedHtml = formatContent(content);
    
    if (!highlights || highlights.length === 0) {
      return formattedHtml;
    }

    // Create a temporary element to work with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedHtml;
    
    // Get the plain text from the formatted HTML
    const plainText = tempDiv.textContent || '';
    
    // Sort highlights by start offset (descending) to apply from end to start
    // This prevents offset shifts when inserting highlight marks
    const sortedHighlights = [...highlights].sort((a, b) => b.startOffset - a.startOffset);
    
    for (const highlight of sortedHighlights) {
      if (highlight.startOffset >= plainText.length) continue;
      
      const actualEnd = Math.min(highlight.endOffset, plainText.length);
      const highlightedText = plainText.substring(highlight.startOffset, actualEnd);
      
      if (!highlightedText.trim()) continue;
      
      // Find and wrap the text in the DOM
      applyHighlightToDOM(tempDiv, highlight.startOffset, actualEnd, highlight.color, highlight.id);
    }
    
    return tempDiv.innerHTML;
  };
  
  // Helper function to apply highlight to DOM based on text offsets
  const applyHighlightToDOM = (container: HTMLElement, startOffset: number, endOffset: number, color: string, highlightId: string) => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    let currentOffset = 0;
    let startNode: Text | null = null;
    let startNodeOffset = 0;
    let endNode: Text | null = null;
    let endNodeOffset = 0;
    
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const nodeLength = node.textContent?.length || 0;
      
      // Find start node
      if (!startNode && currentOffset + nodeLength > startOffset) {
        startNode = node;
        startNodeOffset = startOffset - currentOffset;
      }
      
      // Find end node
      if (currentOffset + nodeLength >= endOffset) {
        endNode = node;
        endNodeOffset = endOffset - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode || !endNode) return;
    
    const colorClass = getColorBg(color);
    
    try {
      // If start and end are in the same text node
      if (startNode === endNode) {
        const text = startNode.textContent || '';
        const before = text.substring(0, startNodeOffset);
        const highlighted = text.substring(startNodeOffset, endNodeOffset);
        const after = text.substring(endNodeOffset);
        
        const fragment = document.createDocumentFragment();
        if (before) fragment.appendChild(document.createTextNode(before));
        
        const mark = document.createElement('mark');
        mark.className = `${colorClass} px-0.5 rounded cursor-pointer`;
        mark.setAttribute('data-highlight-id', highlightId);
        mark.setAttribute('title', 'Click to remove');
        mark.textContent = highlighted;
        fragment.appendChild(mark);
        
        if (after) fragment.appendChild(document.createTextNode(after));
        
        startNode.parentNode?.replaceChild(fragment, startNode);
      } else {
        // For multi-node selections, just highlight the excerpt text if found
        const fullText = container.innerHTML;
        const excerpt = (container.textContent || '').substring(startOffset, endOffset);
        if (excerpt) {
          // Escape special regex characters in the excerpt
          const escapedExcerpt = excerpt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(?<!<[^>]*)${escapedExcerpt}(?![^<]*>)`, 'g');
          let matched = false;
          container.innerHTML = fullText.replace(regex, (match) => {
            if (matched) return match; // Only highlight first occurrence
            matched = true;
            return `<mark class="${colorClass} px-0.5 rounded cursor-pointer" data-highlight-id="${highlightId}" title="Click to remove">${match}</mark>`;
          });
        }
      }
    } catch (e) {
      console.error('Error applying highlight:', e);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'MARK' && target.dataset.highlightId) {
        const highlightId = target.dataset.highlightId;
        if (highlightId) {
          handleDeleteHighlight(highlightId);
        }
      }
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
      return () => container.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Highlighter className="h-4 w-4" />
        <span>Select text to highlight it. Click on a highlight to remove it.</span>
      </div>
      
      <div
        ref={contentRef}
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
        className="prose prose-slate max-w-none markdown-content text-sm md:text-base"
      >
        <div 
          className="formatted-content comparison-content leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderContentWithHighlights() }}
        />
      </div>

      {showColorPicker && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2"
          style={{
            left: `${colorPickerPosition.x}px`,
            top: `${colorPickerPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex items-center gap-1">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                className={`w-7 h-7 rounded-full ${color.bg} border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-300 transition-all hover:scale-110`}
                title={color.name}
                data-testid={`color-${color.name}`}
              />
            ))}
            <button
              onClick={() => setShowColorPicker(false)}
              className="ml-1 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {highlights && highlights.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Highlights ({highlights.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className={`flex items-start gap-2 p-2 rounded ${getColorBg(highlight.color)}`}
              >
                <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  "{highlight.excerpt}"
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleDeleteHighlight(highlight.id)}
                  data-testid={`delete-highlight-${highlight.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
