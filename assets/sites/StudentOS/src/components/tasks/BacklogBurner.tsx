import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, AlertTriangle } from 'lucide-react';
import { calculateDaysOverdue, getBacklogMessage } from '@/lib/calculations';
import { format } from 'date-fns';

interface BacklogBurnerProps {
  tasks: Task[];
  tone: 'gentle' | 'firm' | 'savage';
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function BacklogBurner({ tasks, tone, onUpdateTask }: BacklogBurnerProps) {
  const backlogTasks = tasks
    .filter(t => !t.completed && t.dueDate < new Date())
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  if (backlogTasks.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-emerald-500" />
            <CardTitle>Backlog Burner</CardTitle>
          </div>
          <CardDescription>No overdue tasks! You're crushing it! 🎉</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-red-500/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-500">Backlog Burner 🔥</CardTitle>
        </div>
        <CardDescription>
          {backlogTasks.length} overdue {backlogTasks.length === 1 ? 'task' : 'tasks'} need your attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {backlogTasks.map((task) => {
            const daysOverdue = calculateDaysOverdue(task.dueDate);
            const message = getBacklogMessage(daysOverdue, tone);

            return (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Due: {format(task.dueDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-red-500 flex-shrink-0">
                        {daysOverdue}d overdue
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 mb-3">
                      <p className="text-sm text-slate-300">{message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onUpdateTask(task.id, { completed: true, completedAt: new Date() })}
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateTask(task.id, { dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })}
                      >
                        Extend Deadline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}