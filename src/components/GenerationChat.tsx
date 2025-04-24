
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface GenerationChatProps {
  onGenerate: (prompt: string) => Promise<unknown>;
}

export function GenerationChat({ onGenerate }: GenerationChatProps) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
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
          content: `Error: ${error instanceof Error ? error.message : 'Failed to generate to-do list'}`
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header type="idea" title="Generate To-Do List" />
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-tunnel-medium-gray">
              <p className="mb-2">How would you like to structure your idea?</p>
              <p className="text-sm">
                For example: "Create a step-by-step plan" or "Break this down into manageable phases"
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-tunnel-light-gray text-black'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-lg px-4 py-2 bg-tunnel-light-gray">
              <p className="text-sm">Generating your to-do list...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-tunnel-light-gray p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="flex-1 min-h-[60px]"
            disabled={isGenerating}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!prompt.trim() || isGenerating}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
