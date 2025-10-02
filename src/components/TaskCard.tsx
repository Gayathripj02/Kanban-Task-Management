
import { Task } from '@/types/kanban';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, X } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return 'border-l-gray-300';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`mb-3 border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 hover:shadow-md animate-fade-in`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
            />
            <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-6 w-6 hover:bg-accent"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {task.description && (
          <p className={`text-xs mb-3 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${getPriorityBadgeColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          {task.deadline && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(task.deadline), 'MMM d')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
