
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Priority, SortBy } from '@/types/kanban';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Search, Moon, Sun } from 'lucide-react';

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: Priority;
  onPriorityFilterChange: (priority: Priority) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
}

const Toolbar = ({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
}: ToolbarProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-end">
      <div className="relative flex-1 md:flex-initial md:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border"
        />
      </div>
      
      <Select value={priorityFilter} onValueChange={(value) => onPriorityFilterChange(value as Priority)}>
        <SelectTrigger className="w-full md:w-[140px] bg-background border-border">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
        <SelectTrigger className="w-full md:w-[140px] bg-background border-border">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          <SelectItem value="custom">Custom Order</SelectItem>
          <SelectItem value="deadline">By Deadline</SelectItem>
          <SelectItem value="status">By Status</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleDarkMode}
        className="bg-background border-border hover:bg-accent"
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Toolbar;
