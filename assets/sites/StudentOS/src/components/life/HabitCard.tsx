import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Flame, Trash2 } from 'lucide-react';
import { Habit } from '@/types';
import { isToday, startOfDay } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onMarkComplete: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({ habit, onMarkComplete, onDelete }: HabitCardProps) {
  const today = startOfDay(new Date());
  const completedToday = habit.completedDates.some((date) => 
    isToday(new Date(date))
  );

  const thisWeekCompleted = habit.completedDates.filter((date) => {
    const d = new Date(date);
    const daysDiff = Math.floor((today.getTime() - startOfDay(d).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff < 7;
  }).length;

  const weekProgress = (thisWeekCompleted / habit.targetDays) * 100;

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${completedToday ? 'border-emerald-500/50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{habit.icon}</div>
            <div>
              <CardTitle className="text-lg">{habit.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{habit.category}</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-red-500"
            onClick={() => onDelete(habit.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`h-5 w-5 ${habit.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-sm font-medium">{habit.currentStreak} day streak</p>
              <p className="text-xs text-muted-foreground">Best: {habit.longestStreak} days</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={completedToday ? 'secondary' : 'default'}
            className="gap-2"
            onClick={() => !completedToday && onMarkComplete(habit.id)}
            disabled={completedToday}
          >
            {completedToday ? (
              <>
                <Check className="h-4 w-4" />
                Done Today
              </>
            ) : (
              'Mark Complete'
            )}
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">This Week</span>
            <span className="text-sm text-muted-foreground">
              {thisWeekCompleted} / {habit.targetDays} days
            </span>
          </div>
          <Progress value={weekProgress} className="h-2" />
          {weekProgress >= 100 && (
            <Badge variant="outline" className="mt-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Weekly Goal Achieved! 🎉
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}