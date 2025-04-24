
import { useNavigate } from 'react-router-dom';
import { Settings, Home, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  type: 'home' | 'settings' | 'idea';
  title?: string;
  onToggleView?: () => void;
  currentView?: 'notes' | 'todo';
}

export function Header({ type, title, onToggleView, currentView }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="py-4 px-4 flex items-center justify-between border-b border-tunnel-light-gray">
      <div className="flex items-center">
        {type === 'idea' && (
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-medium ml-2">{title || 'Tunnel'}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {type === 'idea' && onToggleView && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleView}
            className="text-sm font-normal"
          >
            {currentView === 'notes' ? 'View To-Do List' : 'View Notes'}
          </Button>
        )}
        
        {type === 'home' && (
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="h-5 w-5" />
          </Button>
        )}
        
        {type === 'settings' && (
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Home className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
