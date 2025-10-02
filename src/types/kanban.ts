
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export type Priority = 'low' | 'medium' | 'high' | 'all';
export type SortBy = 'deadline' | 'status' | 'custom';
