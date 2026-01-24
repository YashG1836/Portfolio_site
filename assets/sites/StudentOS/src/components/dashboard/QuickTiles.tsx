import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Code2, Heart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickTile {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  status?: 'good' | 'warning' | 'critical';
}

interface QuickTilesProps {
  tiles: QuickTile[];
}

export function QuickTiles({ tiles }: QuickTilesProps) {
  const getStatusIcon = (status?: 'good' | 'warning' | 'critical') => {
    if (status === 'good') return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    if (status === 'warning') return <AlertCircle className="h-4 w-4 text-amber-500" />;
    if (status === 'critical') return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile, index) => (
        <Link key={index} to={tile.href}>
          <Card className={cn(
            'bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:scale-105 cursor-pointer',
            tile.color
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-slate-400">{tile.title}</p>
                  <p className="text-3xl font-bold">{tile.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">{tile.subtitle}</p>
                    {getStatusIcon(tile.status)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  {tile.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function getDefaultQuickTiles(
  coursesCount: number,
  avgAttendance: number,
  contestsCount: number,
  currentStreak: number,
  pendingTasks: number
): QuickTile[] {
  const getAttendanceStatus = (avg: number): 'good' | 'warning' | 'critical' => {
    if (avg >= 80) return 'good';
    if (avg >= 75) return 'warning';
    return 'critical';
  };

  return [
    {
      title: 'Academic Survivor',
      value: `${avgAttendance}%`,
      subtitle: `${coursesCount} active courses`,
      icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
      color: 'hover:border-blue-500/50',
      href: '/academic',
      status: getAttendanceStatus(avgAttendance),
    },
    {
      title: 'Career Forge',
      value: contestsCount,
      subtitle: 'Upcoming contests',
      icon: <Code2 className="h-6 w-6 text-emerald-500" />,
      color: 'hover:border-emerald-500/50',
      href: '/career',
      status: contestsCount > 0 ? 'good' : undefined,
    },
    {
      title: 'Life Support',
      value: `${currentStreak} 🔥`,
      subtitle: 'Current streak',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      color: 'hover:border-red-500/50',
      href: '/life',
      status: currentStreak > 7 ? 'good' : undefined,
    },
    {
      title: 'Tasks Pending',
      value: pendingTasks,
      subtitle: 'Need attention',
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      color: 'hover:border-amber-500/50',
      href: '/tasks',
      status: pendingTasks > 5 ? 'warning' : 'good',
    },
  ];
}