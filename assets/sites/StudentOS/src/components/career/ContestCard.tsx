import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink, Trophy } from 'lucide-react';
import { Contest } from '@/types';
import { format, formatDistanceToNow, isPast } from 'date-fns';

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const isUpcoming = !isPast(contest.startTime);
  const timeUntil = isUpcoming ? formatDistanceToNow(contest.startTime, { addSuffix: true }) : 'Ended';

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'codeforces':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'leetcode':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'codechef':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'atcoder':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${!isUpcoming ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Trophy className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{contest.name}</CardTitle>
              <Badge variant="outline" className={`mt-1 ${getPlatformColor(contest.platform)}`}>
                {contest.platform}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(contest.startTime, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(contest.startTime, 'hh:mm a')} • {contest.duration} mins</span>
          </div>
        </div>

        <div className={`text-sm font-medium ${isUpcoming ? 'text-emerald-500' : 'text-muted-foreground'}`}>
          {timeUntil}
        </div>

        {contest.url && (
          <Button variant="outline" className="w-full gap-2" asChild>
            <a href={contest.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View Contest
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}