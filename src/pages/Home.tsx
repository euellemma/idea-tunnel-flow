
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { IdeaListItem } from '@/components/IdeaListItem';
import { useTunnelStore } from '@/lib/store';
import { useSettings } from '@/hooks/use-settings';

export default function Home() {
  const navigate = useNavigate();
  const { apiKey } = useSettings();
  const ideas = useTunnelStore(state => state.ideas);
  const createIdea = useTunnelStore(state => state.createIdea);
  const deleteIdea = useTunnelStore(state => state.deleteIdea);
  
  // Redirect to settings if API key is not set
  useEffect(() => {
    if (!apiKey) {
      navigate('/settings');
    }
  }, [apiKey, navigate]);
  
  const handleCreateIdea = () => {
    const id = createIdea();
    navigate(`/idea/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header type="home" />
      
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60">
            <p className="text-tunnel-medium-gray text-center mb-4 text-lg">
              You don't have any ideas yet. Create your first idea!
            </p>
            <Button onClick={handleCreateIdea} className="text-base">
              <Plus className="h-6 w-6 mr-2" />
              New Idea
            </Button>
          </div>
        ) : (
          <div>
            {ideas.map(idea => (
              <IdeaListItem 
                key={idea.id} 
                idea={idea} 
                onDelete={deleteIdea} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
