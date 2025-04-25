
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { NotesEditor } from '@/components/NotesEditor';
import { TodoList } from '@/components/TodoList';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { GenerationChat } from '@/components/GenerationChat';
import { useIdea } from '@/hooks/use-idea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Notebook, ListChecks } from 'lucide-react';

export default function IdeaDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showGenerationChat, setShowGenerationChat] = useState(false);
  
  const {
    idea,
    updateName,
    updateNotes,
    toggleView,
    deleteIdea,
    generateTodo,
    updateTaskText,
    updateSubtaskText,
    updateTaskCompletion,
    updateSubtaskCompletion,
    deleteTask,
    deleteSubtask
  } = useIdea(id || '');
  
  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-tunnel-medium-gray text-center mb-4">
          Idea not found. It may have been deleted.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="text-tunnel-black underline"
        >
          Return to Ideas
        </button>
      </div>
    );
  }
  
  const handleGenerate = async (prompt: string) => {
    const result = await generateTodo(prompt);
    return result;
  };

  return (
    <>
      {showGenerationChat ? (
        <GenerationChat 
          onGenerate={handleGenerate} 
          onBack={() => setShowGenerationChat(false)}
          ideaId={idea.id}
        />
      ) : (
        <div className="flex flex-col min-h-screen">
          <header className="py-4 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-7 w-7" />
              </Button>
              
              <Input
                value={idea.name}
                onChange={(e) => updateName(e.target.value)}
                className="text-xl font-medium border-none shadow-none focus-visible:ring-0 px-2 w-auto"
                placeholder="Untitled Idea"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleView}
              className="text-sm font-normal"
            >
              {idea.lastView === 'notes' ? <ListChecks className="h-7 w-7" /> : <Notebook className="h-7 w-7" />}
            </Button>
          </header>
          
          <main className="flex-1 p-4 max-w-3xl mx-auto w-full overflow-hidden">
            {idea.lastView === 'notes' ? (
              <NotesEditor
                notes={idea.notes}
                onUpdateNotes={updateNotes}
              />
            ) : (
              <TodoList
                tasks={idea.todoList?.tasks || []}
                onUpdateTaskText={updateTaskText}
                onUpdateSubtaskText={updateSubtaskText}
                onUpdateTaskCompletion={updateTaskCompletion}
                onUpdateSubtaskCompletion={updateSubtaskCompletion}
                onDeleteTask={deleteTask}
                onDeleteSubtask={deleteSubtask}
              />
            )}
          </main>
          
          <FloatingActionButton onClick={() => setShowGenerationChat(true)} />
        </div>
      )}
    </>
  );
}
