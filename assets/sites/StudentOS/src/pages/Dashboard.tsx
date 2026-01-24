import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { BrainBandwidthMeter } from '@/components/dashboard/BrainBandwidthMeter';
import { ConsistencyGrid } from '@/components/dashboard/ConsistencyGrid';
import { QuickTiles, getDefaultQuickTiles } from '@/components/dashboard/QuickTiles';
import { UpcomingSection } from '@/components/dashboard/UpcomingSection';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookOpen, Target, Flame, CheckCircle2, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { calculateAttendancePercentage, calculateBrainBandwidth } from '@/lib/calculations';
import { isPast, isToday } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { courses, tasks, habits, streakLogs, events, contests, settings } = useData();

  const needsSetup = courses.length === 0 || !settings.codeforcesHandle;

  // Calculate stats
  const totalClasses = courses.reduce((sum, course) => sum + (course.attendanceRecords?.length || 0), 0);
  const attendedClasses = courses.reduce(
    (sum, course) => sum + (course.attendanceRecords?.filter((r) => r.present).length || 0),
    0
  );
  const avgAttendance = totalClasses > 0 ? calculateAttendancePercentage(attendedClasses, totalClasses) : 0;

  const activeTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = activeTasks.filter((t) => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate));
  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const activeHabits = habits.filter((h) => h.currentStreak > 0);
  const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  const todayLogs = streakLogs.filter((log) => isToday(log.date));
  const todayScore = todayLogs.reduce((sum, log) => sum + (log.score || 0), 0);

  const { data: cfUser, isFetching: cfLoading, isError: cfError } = useQuery({
    queryKey: ['codeforces-user', settings.codeforcesHandle],
    enabled: !!settings.codeforcesHandle,
    queryFn: async () => {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${settings.codeforcesHandle}`);
      const json = await res.json();
      if (json.status !== 'OK') {
        throw new Error(json.comment || 'Unable to fetch Codeforces user');
      }
      return json.result[0];
    },
  });

  const { data: cfUpcoming } = useQuery({
    queryKey: ['codeforces-contests'],
    queryFn: async () => {
      const res = await fetch('https://codeforces.com/api/contest.list?gym=false');
      const json = await res.json();
      if (json.status !== 'OK') throw new Error(json.comment || 'Unable to fetch contests');
      return json.result
        .filter((c: any) => c.phase === 'BEFORE' && c.relativeTimeSeconds < 0)
        .slice(0, 5)
        .map((c: any) => ({
          id: `cf-${c.id}`,
          name: c.name,
          platform: 'codeforces' as const,
          startTime: new Date(c.startTimeSeconds * 1000),
          duration: Math.round(c.durationSeconds / 60),
          registered: false,
          participated: false,
          url: `https://codeforces.com/contest/${c.id}`,
        }));
    },
  });

  const contestsForDisplay = [...contests, ...(cfUpcoming || [])];
  const bandwidth = calculateBrainBandwidth(tasks, events, contestsForDisplay, habits, courses);
  const quickTiles = getDefaultQuickTiles(
    courses.length,
    avgAttendance,
    contestsForDisplay.length,
    totalStreak,
    activeTasks.length,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Good Morning! 👋</h1>
        <p className="text-muted-foreground">Here's your productivity overview for today</p>
      </div>

      {needsSetup && (
        <Card className="border-blue-500/40 bg-blue-500/5">
          <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-blue-200">Let's personalize your StudentOS.</p>
              <p className="text-sm text-blue-100/80">Add your courses, connect Codeforces, set health targets, and record laundry cadence.</p>
            </div>
            <Button onClick={() => navigate('/onboarding')} variant="default">
              Start setup
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Avg Attendance"
          value={`${avgAttendance.toFixed(0)}%`}
          description={`${attendedClasses} / ${totalClasses} classes`}
          icon={BookOpen}
          iconColor="text-purple-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Active Tasks"
          value={activeTasks.length}
          description={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'All on track'}
          icon={Target}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Habit Streaks"
          value={totalStreak}
          description={`${activeHabits.length} habits active`}
          icon={Flame}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate.toFixed(0)}%`}
          description={`${completedTasks.length} tasks done`}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {settings.codeforcesHandle && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Codeforces</p>
              <p className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                {settings.codeforcesHandle}
              </p>
              <p className="text-sm text-muted-foreground">
                {cfLoading && 'Fetching rating...'}
                {cfError && 'Unable to fetch rating right now.'}
                {cfUser && `Rating ${cfUser.rating ?? '—'} • Max ${cfUser.maxRating ?? '—'}`}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/career')}>
              See contests
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <BrainBandwidthMeter bandwidth={bandwidth} />
        <ConsistencyGrid streakLogs={streakLogs} />
      </div>

      <QuickTiles tiles={quickTiles} />

      <UpcomingSection tasks={tasks} events={events} contests={contestsForDisplay} />
    </div>
  );
}