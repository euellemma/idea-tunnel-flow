
import { useEffect } from 'react';
import { useTunnelStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { apiKey, modelName } = useTunnelStore((state) => state.settings);
  const setApiKey = useTunnelStore((state) => state.setApiKey);
  const setModelName = useTunnelStore((state) => state.setModelName);

  const saveSettings = (newApiKey: string, newModelName: string) => {
    setApiKey(newApiKey);
    setModelName(newModelName);
    toast({
      title: "Settings saved",
      description: "Your API key and model have been updated."
    });
  };

  // Check if required settings are available
  useEffect(() => {
    if (!apiKey) {
      navigate('/settings');
    }
  }, [apiKey, navigate]);

  return {
    apiKey,
    modelName,
    saveSettings,
  };
}
