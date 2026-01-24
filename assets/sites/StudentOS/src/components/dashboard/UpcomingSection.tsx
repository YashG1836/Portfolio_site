import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, Event, Contest } from '@/types';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { Calendar, Clock, Trophy, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UpcomingSectionProps {
  tasks: Task[];
  events: Event[];
  contests: Contest[];
}

export function UpcomingSection({ tasks, events, contests }: UpcomingSectionProps) {
  const now = new Date();
  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    const days = differenceInDays(date, new Date());
    if (days <= 7) return `In ${days} days`;
    return format(date, 'MMM d');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const upcomingItems = [
    ...tasks
      .filter((t) => !t.completed && t.dueDate)
      .map((t) => ({
        type: 'task' as const,
        title: t.title,
        date: new Date(t.dueDate as Date),
        priority: t.priority,
        icon: <FileText className="h-4 w-4" />,
      })),
    ...events
      .filter((e) => e.startTime)
      .map((e) => ({
        type: 'event' as const,
        title: e.title,
        date: new Date(e.startTime),
        category: e.category,
        icon: <Calendar className="h-4 w-4" />,
      })),
    ...contests
      .filter((c) => !c.participated && c.startTime)
      .map((c) => ({
        type: 'contest' as const,
        title: c.name,
        date: new Date(c.startTime),
        platform: c.platform,
        icon: <Trophy className="h-4 w-4" />,
      })),
  ]
    .filter((item) => item.date && !Number.isNaN(item.date.getTime()) && item.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 8);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          <CardTitle>Upcoming (Next 7 Days)</CardTitle>
        </div>
        <CardDescription>Your schedule at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No upcoming items. You're all clear! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="p-2 rounded-lg bg-slate-700">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      {getDateLabel(item.date)}
                    </span>
                    {item.type === 'task' && (
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    )}
                    {item.type === 'contest' && (
                      <Badge variant="outline" className="text-xs">
                        {item.platform}
                      </Badge>
                    )}
                  </div>
                </div>
                {item.type === 'task' && item.priority === 'critical' && (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}