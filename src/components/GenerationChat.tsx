
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ChevronLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTunnelStore } from '@/lib/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  hasError?: boolean;
}

interface GenerationChatProps {
  onGenerate: (prompt: string) => Promise<unknown>;
  onBack: () => void;
  ideaId: string;
}

export function GenerationChat({ onGenerate, onBack, ideaId }: GenerationChatProps) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const updateIdea = useTunnelStore(state => state.updateIdea);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || isGenerating) return;
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);
    
    try {
      // Generate the todo list
      await onGenerate(userMessage.content);
      
      // Add assistant response
      setMessages(prev => [
        ...prev, 
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Done! Your to-do list has been generated.'
        }
      ]);
    } catch (error) {
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to generate to-do list'}`,
          hasError: true
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRetry = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .slice(-1)[0];
      
    if (!lastUserMessage) return;
    
    setIsGenerating(true);
    
    try {
      await onGenerate(lastUserMessage.content);
      
      // Replace the error message with success message
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
          newMessages[lastIndex] = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Done! Your to-do list has been generated.'
          };
        }
        return newMessages;
      });
    } catch (error) {
      // Replace with new error message
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
          newMessages[lastIndex] = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Error: ${error instanceof Error ? error.message : 'Failed to generate to-do list'}`,
            hasError: true
          };
        }
        return newMessages;
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleViewTodoList = () => {
    // Update idea's lastView to 'todo'
    updateIdea(ideaId, { lastView: 'todo' });
    onBack();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="py-4 px-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium">Chat</h1>
        <div className="w-10"></div> {/* Empty div for centering */}
      </header>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-tunnel-medium-gray">
              <p className="mb-2 text-lg">How would you like to structure your idea?</p>
              <p className="text-base">
                For example: "Create a step-by-step plan" or "Break this down into manageable phases"
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col"
            >
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-tunnel-light-gray text-black'
                  }`}
                >
                  <p className="text-base">{message.content}</p>
                </div>
              </div>
              
              {/* Add buttons below assistant messages */}
              {message.role === 'assistant' && !isGenerating && (
                <div className="flex justify-start mt-2 ml-1">
                  {message.hasError ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRetry}
                      className="text-base"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewTodoList}
                      className="text-base"
                    >
                      Open
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-lg px-4 py-3 bg-tunnel-light-gray">
              <p className="text-base">Generating your to-do list...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="flex-1 min-h-[60px] text-base"
            disabled={isGenerating}
          />
          <div className="flex items-stretch">
            <Button 
              type="submit" 
              disabled={!prompt.trim() || isGenerating}
              className="h-full flex-shrink-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
