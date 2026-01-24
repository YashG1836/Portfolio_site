import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainBandwidth } from '@/types';
import { Brain } from 'lucide-react';

interface BrainBandwidthMeterProps {
  bandwidth: BrainBandwidth;
}

export function BrainBandwidthMeter({ bandwidth }: BrainBandwidthMeterProps) {
  const percentage = (bandwidth.totalLoad / bandwidth.maxLoad) * 100;
  
  const getStatusColor = () => {
    if (percentage < 40) return 'text-emerald-500';
    if (percentage < 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusText = () => {
    if (percentage < 40) return 'Light Load - You got this! 💪';
    if (percentage < 70) return 'Moderate Load - Stay focused 🎯';
    return 'Heavy Load - Prioritize wisely! 🔥';
  };

  const getProgressColor = () => {
    if (percentage < 40) return 'bg-emerald-500';
    if (percentage < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <CardTitle>Brain Bandwidth Meter</CardTitle>
        </div>
        <CardDescription>Your workload for the next 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Load</span>
            <span className={`text-sm font-bold ${getStatusColor()}`}>
              {bandwidth.totalLoad}/{bandwidth.maxLoad}
            </span>
          </div>
          <Progress value={percentage} className="h-3" indicatorClassName={getProgressColor()} />
          <p className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Classes</span>
              <span className="font-medium">{bandwidth.breakdown.classes}</span>
            </div>
            <Progress value={(bandwidth.breakdown.classes / bandwidth.maxLoad) * 100} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assignments</span>
              <span className="font-medium">{bandwidth.breakdown.assignments}</span>
            </div>
            <Progress value={(bandwidth.breakdown.assignments / bandwidth.maxLoad) * 100} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Exams</span>
              <span className="font-medium">{bandwidth.breakdown.exams}</span>
            </div>
            <Progress value={(bandwidth.breakdown.exams / bandwidth.maxLoad) * 100} className="h-1" indicatorClassName="bg-red-500" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Contests</span>
              <span className="font-medium">{bandwidth.breakdown.contests}</span>
            </div>
            <Progress value={(bandwidth.breakdown.contests / bandwidth.maxLoad) * 100} className="h-1" indicatorClassName="bg-amber-500" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Habits</span>
              <span className="font-medium">{bandwidth.breakdown.habits}</span>
            </div>
            <Progress value={(bandwidth.breakdown.habits / bandwidth.maxLoad) * 100} className="h-1" indicatorClassName="bg-emerald-500" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Events</span>
              <span className="font-medium">{bandwidth.breakdown.events}</span>
            </div>
            <Progress value={(bandwidth.breakdown.events / bandwidth.maxLoad) * 100} className="h-1" indicatorClassName="bg-purple-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}