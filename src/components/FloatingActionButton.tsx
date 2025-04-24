
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6">
      <Button 
        size="lg" 
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={onClick}
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    </div>
  );
}
