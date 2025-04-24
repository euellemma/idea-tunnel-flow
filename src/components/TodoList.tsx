
import { useState } from 'react';
import { Edit3, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Task, type Subtask } from '@/lib/store';

interface TodoListProps {
  tasks: Task[];
  onUpdateTaskText: (taskId: string, text: string) => void;
  onUpdateSubtaskText: (taskId: string, subtaskId: string, text: string) => void;
  onUpdateTaskCompletion: (taskId: string, isCompleted: boolean) => void;
  onUpdateSubtaskCompletion: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export function TodoList({
  tasks,
  onUpdateTaskText,
  onUpdateSubtaskText,
  onUpdateTaskCompletion,
  onUpdateSubtaskCompletion,
  onDeleteTask,
  onDeleteSubtask
}: TodoListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteSubtaskData, setDeleteSubtaskData] = useState<{taskId: string, subtaskId: string} | null>(null);
  
  // Task expansion toggle
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  // Subtask expansion toggle
  const toggleSubtaskExpansion = (subtaskId: string) => {
    setExpandedSubtasks(prev => ({
      ...prev,
      [subtaskId]: !prev[subtaskId]
    }));
  };
  
  // Start editing a task
  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };
  
  // Start editing a subtask
  const startEditingSubtask = (subtask: Subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditingText(subtask.text);
  };
  
  // Save task edit
  const saveTaskEdit = () => {
    if (editingTaskId) {
      onUpdateTaskText(editingTaskId, editingText);
      setEditingTaskId(null);
    }
  };
  
  // Save subtask edit
  const saveSubtaskEdit = (taskId: string) => {
    if (editingSubtaskId) {
      onUpdateSubtaskText(taskId, editingSubtaskId, editingText);
      setEditingSubtaskId(null);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingSubtaskId(null);
  };
  
  // Confirm task deletion
  const confirmDeleteTask = () => {
    if (deleteTaskId) {
      onDeleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };
  
  // Confirm subtask deletion
  const confirmDeleteSubtask = () => {
    if (deleteSubtaskData) {
      onDeleteSubtask(deleteSubtaskData.taskId, deleteSubtaskData.subtaskId);
      setDeleteSubtaskData(null);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <p className="text-tunnel-medium-gray text-center">
          No tasks yet. Click the sparkle button to generate tasks from your notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="border-b border-tunnel-light-gray pb-2 last:border-b-0">
          <div className="flex items-start mb-2 group">
            <button 
              onClick={() => toggleTaskExpansion(task.id)}
              className="mt-1 mr-2 outline-none"
            >
              {expandedTasks[task.id] ? (
                <ChevronDown className="h-4 w-4 text-tunnel-medium-gray" />
              ) : (
                <ChevronRight className="h-4 w-4 text-tunnel-medium-gray" />
              )}
            </button>
            
            <div className="flex-1">
              {editingTaskId === task.id ? (
                <div className="flex items-center">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 mr-2"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={saveTaskEdit}>Save</Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="font-medium cursor-pointer"
                  onClick={() => toggleTaskExpansion(task.id)}
                >
                  {task.text}
                </div>
              )}
            </div>
            
            {!editingTaskId && expandedTasks[task.id] && (
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => startEditingTask(task)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setDeleteTaskId(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {expandedTasks[task.id] && (
            <div className="pl-6 space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="pb-1">
                  <div className="flex items-start group">
                    <Checkbox
                      checked={subtask.isCompleted}
                      onCheckedChange={(checked) => 
                        onUpdateSubtaskCompletion(task.id, subtask.id, checked === true)
                      }
                      className="mt-1 mr-2"
                    />
                    
                    <div className="flex-1">
                      {editingSubtaskId === subtask.id ? (
                        <div className="flex items-center">
                          <Input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 mr-2"
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => saveSubtaskEdit(task.id)}>Save</Button>
                            <Button size="sm" variant="outline" onClick={cancelEditing}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div 
                            className={`text-sm cursor-pointer ${subtask.isCompleted ? 'line-through text-tunnel-medium-gray' : ''}`}
                            onClick={() => toggleSubtaskExpansion(subtask.id)}
                          >
                            {subtask.text}
                          </div>
                          
                          {expandedSubtasks[subtask.id] && (
                            <div className="mt-2 ml-2 text-xs text-tunnel-medium-gray space-y-1">
                              <div><span className="font-medium">Time:</span> {subtask.timeEstimate}</div>
                              <div><span className="font-medium">Tip:</span> {subtask.tips}</div>
                              <div><span className="font-medium">Note:</span> {subtask.encouragement}</div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {!editingSubtaskId && (
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => startEditingSubtask(subtask)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setDeleteSubtaskData({ taskId: task.id, subtaskId: subtask.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={deleteTaskId !== null} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task and all its subtasks? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Subtask Confirmation Dialog */}
      <AlertDialog open={deleteSubtaskData !== null} onOpenChange={() => setDeleteSubtaskData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subtask</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subtask? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSubtask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
