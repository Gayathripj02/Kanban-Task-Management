
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Column, Task, Priority, SortBy } from '@/types/kanban';
import { saveToLocalStorage, getInitialColumns } from '@/utils/storage';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import Toolbar from './Toolbar';
import { toast } from '@/hooks/use-toast';

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(getInitialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority>('all');
  const [sortBy, setSortBy] = useState<SortBy>('custom');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    saveToLocalStorage(columns);
  }, [columns]);

  const addTask = (columnId: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    setColumns(prev => 
      prev.map(col => 
        col.id === columnId 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );

    toast({
      title: "Task created",
      description: `"${taskData.title}" has been added to ${columns.find(c => c.id === columnId)?.title}.`,
    });
  };

  const updateTask = (updatedTask: Task) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }))
    );
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: `"${updatedTask.title}" has been updated.`,
    });
  };

  const deleteTask = (taskId: string) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId)
      }))
    );
    toast({
      title: "Task deleted",
      description: "Task has been removed.",
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    let draggedTask: Task | null = null;
    let sourceColumnId: string | null = null;

    // Find the task and source column
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        draggedTask = task;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!draggedTask || !sourceColumnId || sourceColumnId === targetColumnId) {
      return;
    }

    // Move task between columns
    setColumns(prev => 
      prev.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, draggedTask] };
        }
        return col;
      })
    );

    toast({
      title: "Task moved",
      description: `"${draggedTask.title}" moved to ${columns.find(c => c.id === targetColumnId)?.title}.`,
    });
  };

  const filterAndSortTasks = (tasks: Task[]) => {
    let filteredTasks = tasks;

    // Filter by search term
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // Sort tasks
    if (sortBy === 'deadline') {
      filteredTasks.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortBy === 'status') {
      filteredTasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    }

    return filteredTasks;
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Kanban Board
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Organize your tasks efficiently
          </p>
          
          {/* Toolbar */}
          <div className="mb-8">
            <Toolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <Card
              key={column.id}
              className="bg-card border-border shadow-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-card-foreground flex items-center justify-between">
                  {column.title}
                  <span className="bg-muted text-muted-foreground text-sm px-2 py-1 rounded-full">
                    {filterAndSortTasks(column.tasks).length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddTaskForm
                  onAddTask={(taskData) => addTask(column.id, taskData)}
                />
                <div className="space-y-3 min-h-[200px]">
                  {filterAndSortTasks(column.tasks).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={deleteTask}
                      onToggleComplete={toggleTaskComplete}
                    />
                  ))}
                  {filterAndSortTasks(column.tasks).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks yet</p>
                      <p className="text-sm">Add a task to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <AddTaskForm
          editingTask={editingTask}
          onUpdateTask={updateTask}
          onCancelEdit={() => setEditingTask(null)}
          onAddTask={() => {}}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
