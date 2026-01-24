import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { ContestCard } from '@/components/career/ContestCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Trophy, Target } from 'lucide-react';
import { isPast } from 'date-fns';

export default function Career() {
  const { contests, studyTracks } = useData();
  const [activeTab, setActiveTab] = useState('contests');

  const upcomingContests = contests
    .filter((c) => !isPast(c.startTime))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const pastContests = contests
    .filter((c) => isPast(c.startTime))
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-emerald-500/10">
          <Code2 className="h-6 w-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Career Forge</h1>
          <p className="text-muted-foreground">Track contests and skill development</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contests">
            <Trophy className="h-4 w-4 mr-2" />
            Contests ({upcomingContests.length})
          </TabsTrigger>
          <TabsTrigger value="tracks">
            <Target className="h-4 w-4 mr-2" />
            Study Tracks ({studyTracks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contests" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Contests</h2>
            {upcomingContests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">No upcoming contests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingContests.map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
              </div>
            )}
          </div>

          {pastContests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Contests</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastContests.slice(0, 6).map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tracks" className="space-y-4">
          {studyTracks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No study tracks yet</p>
              </CardContent>
            </Card>
          ) : (
            studyTracks.map((track) => (
              <Card key={track.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{track.name}</CardTitle>
                    <div className="text-sm font-medium text-muted-foreground">
                      {track.completed} / {track.total}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={(track.completed / track.total) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">{track.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{track.category}</span>
                    <span>•</span>
                    <span>{Math.round((track.completed / track.total) * 100)}% complete</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}