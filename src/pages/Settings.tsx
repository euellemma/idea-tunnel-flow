
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-settings';

export default function Settings() {
  const { apiKey, modelName, saveSettings } = useSettings();
  const [key, setKey] = useState(apiKey);
  const [model, setModel] = useState(modelName);
  
  useEffect(() => {
    setKey(apiKey);
    setModel(modelName);
  }, [apiKey, modelName]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(key, model);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header type="settings" title="Settings" />
      
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenRouter API Key</Label>
            <Input 
              id="apiKey" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="or-..."
              required
            />
            <p className="text-sm text-tunnel-medium-gray">
              Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai/keys</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modelName">LLM Model</Label>
            <Input 
              id="modelName" 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., claude-3-opus-20240229"
              required
            />
            <p className="text-sm text-tunnel-medium-gray">
              For example: claude-3-opus-20240229, gpt-4-turbo, mistral-large-latest
            </p>
          </div>
          
          <Button type="submit" className="w-full">
            Save Settings
          </Button>
        </form>
      </main>
    </div>
  );
}
