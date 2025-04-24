
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subtask {
  id: string;
  text: string;
  isCompleted: boolean;
  timeEstimate: string;
  tips: string;
  encouragement: string;
}

export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  subtasks: Subtask[];
}

export interface TodoList {
  tasks: Task[];
}

export interface Idea {
  id: string;
  name: string;
  notes: string;
  lastView: 'notes' | 'todo';
  createdAt: string;
  updatedAt: string;
  todoList: TodoList | null;
}

export interface Settings {
  apiKey: string;
  modelName: string;
}

interface TunnelState {
  settings: Settings;
  ideas: Idea[];
  setApiKey: (apiKey: string) => void;
  setModelName: (modelName: string) => void;
  createIdea: () => string;
  updateIdeaName: (id: string, name: string) => void;
  updateIdeaNotes: (id: string, notes: string) => void;
  updateIdeaLastView: (id: string, lastView: 'notes' | 'todo') => void;
  updateIdeaTodoList: (id: string, todoList: TodoList) => void;
  deleteIdea: (id: string) => void;
  updateTaskCompletion: (ideaId: string, taskId: string, isCompleted: boolean) => void;
  updateSubtaskCompletion: (ideaId: string, taskId: string, subtaskId: string, isCompleted: boolean) => void;
  updateTaskText: (ideaId: string, taskId: string, text: string) => void;
  updateSubtaskText: (ideaId: string, taskId: string, subtaskId: string, text: string) => void;
  deleteTask: (ideaId: string, taskId: string) => void;
  deleteSubtask: (ideaId: string, taskId: string, subtaskId: string) => void;
}

export const useTunnelStore = create<TunnelState>()(
  persist(
    (set) => ({
      settings: {
        apiKey: '',
        modelName: 'claude-3-opus-20240229',
      },
      ideas: [],
      
      setApiKey: (apiKey) => set((state) => ({
        settings: { ...state.settings, apiKey }
      })),
      
      setModelName: (modelName) => set((state) => ({
        settings: { ...state.settings, modelName }
      })),
      
      createIdea: () => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        
        set((state) => ({
          ideas: [...state.ideas, {
            id,
            name: 'New Idea',
            notes: '',
            lastView: 'notes' as const,
            createdAt: now,
            updatedAt: now,
            todoList: null
          }]
        }));
        
        return id;
      },
      
      updateIdeaName: (id, name) => set((state) => ({
        ideas: state.ideas.map(idea => 
          idea.id === id 
            ? { ...idea, name, updatedAt: new Date().toISOString() } 
            : idea
        )
      })),
      
      updateIdeaNotes: (id, notes) => set((state) => ({
        ideas: state.ideas.map(idea => 
          idea.id === id 
            ? { ...idea, notes, updatedAt: new Date().toISOString() } 
            : idea
        )
      })),
      
      updateIdeaLastView: (id, lastView) => set((state) => ({
        ideas: state.ideas.map(idea => 
          idea.id === id 
            ? { ...idea, lastView, updatedAt: new Date().toISOString() } 
            : idea
        )
      })),
      
      updateIdeaTodoList: (id, todoList) => set((state) => ({
        ideas: state.ideas.map(idea => 
          idea.id === id 
            ? { ...idea, todoList, updatedAt: new Date().toISOString() } 
            : idea
        )
      })),
      
      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter(idea => idea.id !== id)
      })),
      
      updateTaskCompletion: (ideaId, taskId, isCompleted) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id !== ideaId || !idea.todoList) return idea;
          
          const updatedTasks = idea.todoList.tasks.map(task => 
            task.id === taskId ? { ...task, isCompleted } : task
          );
          
          return {
            ...idea,
            todoList: { ...idea.todoList, tasks: updatedTasks },
            updatedAt: new Date().toISOString()
          };
        })
      })),
      
      updateSubtaskCompletion: (ideaId, taskId, subtaskId, isCompleted) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id !== ideaId || !idea.todoList) return idea;
          
          const updatedTasks = idea.todoList.tasks.map(task => {
            if (task.id !== taskId) return task;
            
            const updatedSubtasks = task.subtasks.map(subtask =>
              subtask.id === subtaskId ? { ...subtask, isCompleted } : subtask
            );
            
            return { ...task, subtasks: updatedSubtasks };
          });
          
          return {
            ...idea,
            todoList: { ...idea.todoList, tasks: updatedTasks },
            updatedAt: new Date().toISOString()
          };
        })
      })),
      
      updateTaskText: (ideaId, taskId, text) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id !== ideaId || !idea.todoList) return idea;
          
          const updatedTasks = idea.todoList.tasks.map(task => 
            task.id === taskId ? { ...task, text } : task
          );
          
          return {
            ...idea,
            todoList: { ...idea.todoList, tasks: updatedTasks },
            updatedAt: new Date().toISOString()
          };
        })
      })),
      
      updateSubtaskText: (ideaId, taskId, subtaskId, text) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id !== ideaId || !idea.todoList) return idea;
          
          const updatedTasks = idea.todoList.tasks.map(task => {
            if (task.id !== taskId) return task;
            
            const updatedSubtasks = task.subtasks.map(subtask =>
              subtask.id === subtaskId ? { ...subtask, text } : subtask
            );
            
            return { ...task, subtasks: updatedSubtasks };
          });
          
          return {
            ...idea,
            todoList: { ...idea.todoList, tasks: updatedTasks },
            updatedAt: new Date().toISOString()
          };
        })
      })),
      
      deleteTask: (ideaId, taskId) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id !== ideaId || !idea.todoList) return idea;
          
          const updatedTasks = idea.todoList.tasks.filter(task => task.id !== taskId);
          
          return {
            ...idea,
            todoList: { ...idea.todoList, tasks: updatedTasks },
            updatedAt: new Date().toISOString()
          };
        })
      })),
      
      deleteSubtask: (ideaId, taskId, subtaskId) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id !== ideaId || !idea.todoList) return idea;
          
          const updatedTasks = idea.todoList.tasks.map(task => {
            if (task.id !== taskId) return task;
            
            const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
            
            return { ...task, subtasks: updatedSubtasks };
          });
          
          return {
            ...idea,
            todoList: { ...idea.todoList, tasks: updatedTasks },
            updatedAt: new Date().toISOString()
          };
        })
      })),
    }),
    {
      name: 'tunnel-storage',
    }
  )
);
