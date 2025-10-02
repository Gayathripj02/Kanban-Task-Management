
import KanbanBoard from '@/components/KanbanBoard';
import { DarkModeProvider } from '@/hooks/useDarkMode';

const Index = () => {
  return (
    <DarkModeProvider>
      <KanbanBoard />
    </DarkModeProvider>
  );
};

export default Index;
