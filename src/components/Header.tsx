
import { useNavigate } from 'react-router-dom';
import { Settings, Home, ChevronLeft, Notebook, ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTunnelStore } from '@/lib/store';

interface HeaderProps {
  type: 'home' | 'settings' | 'idea';
  title?: string;
  onToggleView?: () => void;
  currentView?: 'notes' | 'todo';
}

export function Header({ type, title, onToggleView, currentView }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="py-4 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {type === 'idea' && (
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {type === 'idea' && onToggleView && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleView}
            className="text-sm font-normal"
          >
            {currentView === 'notes' ? <ListChecks className="h-6 w-6" /> : <Notebook className="h-6 w-6" />}
          </Button>
        )}
        
        {type === 'home' && (
          <>
            <Button variant="ghost" size="icon" onClick={() => navigate('/idea/' + useTunnelStore.getState().createIdea())}>
              <Plus className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-6 w-6" />
            </Button>
          </>
        )}
        
        {type === 'settings' && (
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Home className="h-6 w-6" />
          </Button>
        )}
      </div>
    </header>
  );
}
