import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StreakLog } from '@/types';
import { format, subDays } from 'date-fns';
import { Flame } from 'lucide-react';

interface ConsistencyGridProps {
  streakLogs: StreakLog[];
}

export function ConsistencyGrid({ streakLogs }: ConsistencyGridProps) {
  const today = new Date();
  const days = 84; // 12 weeks
  
  const getActivityLevel = (count: number): string => {
    if (count === 0) return 'bg-slate-800';
    if (count < 5) return 'bg-emerald-900/40';
    if (count < 10) return 'bg-emerald-700/60';
    if (count < 15) return 'bg-emerald-500/80';
    return 'bg-emerald-400';
  };

  const gridDays = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    const log = streakLogs.find((l) => 
      format(l.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return {
      date,
      count: log?.activityCount || 0,
    };
  });

  const weeks = [];
  for (let i = 0; i < gridDays.length; i += 7) {
    weeks.push(gridDays.slice(i, i + 7));
  }

  const totalActivities = streakLogs.reduce((sum, log) => sum + log.activityCount, 0);
  const avgPerDay = (totalActivities / days).toFixed(1);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <CardTitle>Consistency Grid</CardTitle>
        </div>
        <CardDescription>Your activity over the last 12 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-slate-400">Total Activities: </span>
              <span className="font-bold text-emerald-500">{totalActivities}</span>
            </div>
            <div>
              <span className="text-slate-400">Avg/Day: </span>
              <span className="font-bold text-blue-500">{avgPerDay}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getActivityLevel(day.count)} transition-colors hover:ring-2 hover:ring-blue-500 cursor-pointer`}
                      title={`${format(day.date, 'MMM d, yyyy')}: ${day.count} activities`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-slate-800" />
              <div className="w-3 h-3 rounded-sm bg-emerald-900/40" />
              <div className="w-3 h-3 rounded-sm bg-emerald-700/60" />
              <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}