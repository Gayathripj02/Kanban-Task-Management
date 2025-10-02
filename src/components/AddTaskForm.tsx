
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Task } from '@/types/kanban';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editingTask?: Task | null;
  onUpdateTask?: (task: Task) => void;
  onCancelEdit?: () => void;
}

const AddTaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }: AddTaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editingTask?.priority || 'medium');
  const [deadline, setDeadline] = useState(editingTask?.deadline || '');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDeadline('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        priority,
        deadline: deadline || undefined,
      });
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        deadline: deadline || undefined,
        completed: false,
      });
    }

    resetForm();
    setOpen(false);
    if (onCancelEdit) onCancelEdit();
  };

  // If editing, show the form immediately without dialog
  if (editingTask) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                autoFocus
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update Task
              </Button>
              <Button type="button" variant="outline" onClick={onCancelEdit} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
