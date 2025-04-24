
import { useCallback } from 'react';
import { useTunnelStore, type Idea, type TodoList } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { generateTodoList } from '@/lib/api';

export function useIdea(ideaId: string) {
  const { toast } = useToast();
  const idea = useTunnelStore(state => state.ideas.find(i => i.id === ideaId));
  const updateIdeaName = useTunnelStore(state => state.updateIdeaName);
  const updateIdeaNotes = useTunnelStore(state => state.updateIdeaNotes);
  const updateIdeaLastView = useTunnelStore(state => state.updateIdeaLastView);
  const updateIdeaTodoList = useTunnelStore(state => state.updateIdeaTodoList);
  const deleteIdea = useTunnelStore(state => state.deleteIdea);
  const updateTaskText = useTunnelStore(state => state.updateTaskText);
  const updateSubtaskText = useTunnelStore(state => state.updateSubtaskText);
  const updateTaskCompletion = useTunnelStore(state => state.updateTaskCompletion);
  const updateSubtaskCompletion = useTunnelStore(state => state.updateSubtaskCompletion);
  const deleteTask = useTunnelStore(state => state.deleteTask);
  const deleteSubtask = useTunnelStore(state => state.deleteSubtask);

  // Debounced note update
  const debouncedUpdateNotes = useCallback((notes: string) => {
    if (!ideaId) return;
    updateIdeaNotes(ideaId, notes);
  }, [ideaId, updateIdeaNotes]);

  // Toggle view between notes and todo
  const toggleView = useCallback(() => {
    if (!ideaId || !idea) return;
    const newView = idea.lastView === 'notes' ? 'todo' : 'notes';
    updateIdeaLastView(ideaId, newView);
  }, [ideaId, idea, updateIdeaLastView]);

  // Generate todo list using the API
  const generateTodo = useCallback(async (userPrompt: string) => {
    if (!idea) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Idea not found",
      });
      return null;
    }
    
    try {
      const todoList = await generateTodoList(idea, userPrompt);
      updateIdeaTodoList(ideaId, todoList);
      return todoList;
    } catch (error) {
      console.error("Error generating todo list:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      return null;
    }
  }, [ideaId, idea, updateIdeaTodoList, toast]);

  return {
    idea,
    updateName: (name: string) => updateIdeaName(ideaId, name),
    updateNotes: debouncedUpdateNotes,
    toggleView,
    deleteIdea: () => deleteIdea(ideaId),
    generateTodo,
    updateTaskText: (taskId: string, text: string) => updateTaskText(ideaId, taskId, text),
    updateSubtaskText: (taskId: string, subtaskId: string, text: string) => 
      updateSubtaskText(ideaId, taskId, subtaskId, text),
    updateTaskCompletion: (taskId: string, isCompleted: boolean) => 
      updateTaskCompletion(ideaId, taskId, isCompleted),
    updateSubtaskCompletion: (taskId: string, subtaskId: string, isCompleted: boolean) => 
      updateSubtaskCompletion(ideaId, taskId, subtaskId, isCompleted),
    deleteTask: (taskId: string) => deleteTask(ideaId, taskId),
    deleteSubtask: (taskId: string, subtaskId: string) => deleteSubtask(ideaId, taskId, subtaskId)
  };
}
