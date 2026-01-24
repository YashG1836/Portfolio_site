import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Flag, Trash2, Link2 } from 'lucide-react';
import { Task } from '@/types';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  courseName?: string;
}

export function TaskCard({ task, onToggle, onDelete, courseName }: TaskCardProps) {
  const getDueDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM dd');
  };

  const getDueDateColor = (date: Date) => {
    if (isPast(date) && !task.completed) return 'text-red-500';
    if (isToday(date)) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'academic':
        return 'bg-purple-500/10 text-purple-500';
      case 'career':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'life':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>

              <Badge variant="outline" className={getCategoryColor(task.category)}>
                {task.category}
              </Badge>

              {task.dueDate && (
                <div className={`flex items-center gap-1 text-xs ${getDueDateColor(task.dueDate)}`}>
                  <Calendar className="h-3 w-3" />
                  <span>{getDueDateLabel(task.dueDate)}</span>
                </div>
              )}

              {task.attachmentUrl && (
                <a
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Link2 className="h-3 w-3" />
                  Attachment
                </a>
              )}

              {courseName && (
                <Badge variant="secondary" className="text-xs">
                  {courseName}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}