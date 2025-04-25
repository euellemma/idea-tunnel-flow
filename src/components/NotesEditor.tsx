
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { debounce } from '@/lib/utils';

interface NotesEditorProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export function NotesEditor({ notes, onUpdateNotes }: NotesEditorProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  
  // Create debounced update function
  const debouncedUpdateNotes = useCallback(
    debounce((value: string) => onUpdateNotes(value), 500),
    [onUpdateNotes]
  );
  
  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    debouncedUpdateNotes(newNotes);
  };
  
  // Update local state when props change
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  return (
    <div className="flex flex-col h-full w-full">
      <Textarea
        value={localNotes}
        onChange={handleNotesChange}
        placeholder="Start typing your notes here..."
        className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 p-0 text-base min-h-[calc(100vh-7rem)]"
      />
    </div>
  );
}
