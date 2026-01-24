import { useData } from '@/contexts/DataContext';
import { HabitCard } from './HabitCard';
import { Card, CardContent } from '@/components/ui/card';
import { Smile } from 'lucide-react';

export function HabitTracker() {
  const { habits, markHabitComplete, deleteHabit } = useData();

  const handleMarkComplete = (habitId: string) => {
    markHabitComplete(habitId, new Date());
  };

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Smile className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Habits Yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Start building better habits! Click "Add Habit" to create your first habit tracker.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onMarkComplete={handleMarkComplete}
          onDelete={deleteHabit}
        />
      ))}
    </div>
  );
}