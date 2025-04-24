
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';

interface NotesEditorProps {
  name: string;
  notes: string;
  onUpdateName: (name: string) => void;
  onUpdateNotes: (notes: string) => void;
}

export function NotesEditor({ name, notes, onUpdateName, onUpdateNotes }: NotesEditorProps) {
  const [localName, setLocalName] = useState(name);
  const [localNotes, setLocalNotes] = useState(notes);
  
  // Create debounced update functions
  const debouncedUpdateName = useCallback(
    debounce((value: string) => onUpdateName(value), 500),
    [onUpdateName]
  );
  
  const debouncedUpdateNotes = useCallback(
    debounce((value: string) => onUpdateNotes(value), 500),
    [onUpdateNotes]
  );
  
  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalName(newName);
    debouncedUpdateName(newName);
  };
  
  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    debouncedUpdateNotes(newNotes);
  };
  
  // Update local state when props change
  useEffect(() => {
    setLocalName(name);
    setLocalNotes(notes);
  }, [name, notes]);

  return (
    <div className="flex flex-col h-full">
      <Input
        value={localName}
        onChange={handleNameChange}
        className="text-2xl font-medium border-none shadow-none focus-visible:ring-0 px-0 mb-4"
        placeholder="Untitled Idea"
      />
      <Textarea
        value={localNotes}
        onChange={handleNotesChange}
        placeholder="Start typing your notes here..."
        className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 px-0 text-base"
      />
    </div>
  );
}
