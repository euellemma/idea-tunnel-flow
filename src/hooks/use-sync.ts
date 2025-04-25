
import { useCallback, useEffect } from 'react';
import { useTunnelStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSync() {
  const { toast } = useToast();
  const { settings, lastModified, isSyncNeeded, setSyncNeeded, setLastModified } = useTunnelStore();
  const state = useTunnelStore();

  const fetchRemoteState = useCallback(async () => {
    if (!settings.username) return;

    try {
      const { data, error } = await supabase
        .from('tunnel_sync')
        .select('*')
        .eq('username', settings.username)
        .single();

      if (error) throw error;

      if (data) {
        const remoteLastModified = new Date(data.last_modified);
        const localLastModified = lastModified ? new Date(lastModified) : new Date(0);

        if (remoteLastModified > localLastModified) {
          // Remote is newer, update local state
          const remoteState = data.data;
          Object.entries(remoteState).forEach(([key, value]) => {
            if (key !== 'lastModified' && key !== 'isSyncNeeded') {
              useTunnelStore.setState({ [key]: value });
            }
          });
          setLastModified(data.last_modified);
          setSyncNeeded(false);
        } else if (remoteLastModified < localLastModified) {
          setSyncNeeded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching remote state:', error);
      toast({
        title: "Sync Error",
        description: "Could not fetch remote state. Please try again later.",
      });
    }
  }, [settings.username, lastModified, setSyncNeeded, setLastModified, toast]);

  const syncState = useCallback(async () => {
    if (!settings.username) return;

    try {
      const stateToSync = { ...state };
      delete stateToSync.setUsername;
      delete stateToSync.setSyncNeeded;
      delete stateToSync.setLastModified;
      
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('tunnel_sync')
        .upsert({
          username: settings.username,
          data: stateToSync,
          last_modified: now,
        });

      if (error) throw error;

      setLastModified(now);
      setSyncNeeded(false);
      
      toast({
        title: "Sync Successful",
        description: "Your data has been synchronized.",
      });
    } catch (error) {
      console.error('Error syncing state:', error);
      toast({
        title: "Sync Error",
        description: "Could not sync your data. Please try again later.",
      });
    }
  }, [settings.username, state, setSyncNeeded, setLastModified, toast]);

  // Check for updates on app launch
  useEffect(() => {
    if (navigator.onLine && settings.username) {
      fetchRemoteState();
    }
  }, [settings.username, fetchRemoteState]);

  return { syncState, isSyncNeeded };
}
