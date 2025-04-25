
import { Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSync } from '@/hooks/use-sync';

export function SyncButton() {
  const { syncState, isSyncNeeded } = useSync();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={syncState}
      className="relative"
    >
      <Cloud className="h-7 w-7" />
      {isSyncNeeded && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
      )}
    </Button>
  );
}
