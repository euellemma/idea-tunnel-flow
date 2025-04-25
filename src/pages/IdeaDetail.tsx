
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { NotesEditor } from '@/components/NotesEditor';
import { TodoList } from '@/components/TodoList';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { GenerationChat } from '@/components/GenerationChat';
import { useIdea } from '@/hooks/use-idea';

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
        />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header 
            type="idea" 
            onToggleView={toggleView}
            currentView={idea.lastView}
          />
          
          <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
            {idea.lastView === 'notes' ? (
              <NotesEditor
                name={idea.name}
                notes={idea.notes}
                onUpdateName={updateName}
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
