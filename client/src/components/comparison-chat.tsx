import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ComparisonChatProps {
  comparisonResult: string;
  articleTitle: string;
  selectedLanguages: string[];
  isVisible: boolean;
  onToggle: () => void;
}

export function ComparisonChat({ 
  comparisonResult, 
  articleTitle, 
  selectedLanguages, 
  isVisible, 
  onToggle 
}: ComparisonChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Add initial assistant message
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hello! I've analyzed the comparison of "${articleTitle}" across ${selectedLanguages.join(', ')} languages. You can ask me questions about the findings, request clarifications, or explore specific aspects of the differences I found. What would you like to know more about?`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [isVisible, messages.length, articleTitle, selectedLanguages]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call API to get chat response
      const response = await fetch('/api/chat-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          comparisonContext: comparisonResult,
          articleTitle,
          selectedLanguages,
          chatHistory: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 left-6 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-6 w-[420px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-6rem)] z-50">
      <Card className="h-full flex flex-col shadow-xl border-2 bg-white dark:bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Chat with Analysis</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
          <CardDescription>
            Ask questions about your comparison findings
          </CardDescription>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 px-4 py-2" ref={scrollAreaRef}>
            <div className="space-y-3 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border'
                    }`}
                  >
                    <div className="text-sm leading-6 whitespace-pre-wrap break-words font-normal">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' 
                        ? 'text-purple-200' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <Separator />
          
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about the comparison..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Powered by free AI model
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}