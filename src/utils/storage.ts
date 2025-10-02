
import { Column } from '@/types/kanban';

const STORAGE_KEY = 'kanban-board-data';

export const saveToLocalStorage = (data: Column[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): Column[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const getInitialColumns = (): Column[] => {
  const savedData = loadFromLocalStorage();
  if (savedData) {
    return savedData;
  }

  return [
    {
      id: 'todo',
      title: 'To Do',
      tasks: []
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: []
    },
    {
      id: 'done',
      title: 'Done',
      tasks: []
    }
  ];
};
