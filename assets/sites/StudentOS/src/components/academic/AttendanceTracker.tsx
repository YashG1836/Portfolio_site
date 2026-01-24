import { useMemo } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  calculateAttendancePercentage,
  calculateClassesNeeded,
  calculateClassesToSkip,
} from '@/lib/calculations';
import { Course } from '@/types';

interface AttendanceTrackerProps {
  courses: Course[];
  onUpdateCourse: (id: string, updates: Partial<Course>) => void;
}

export function AttendanceTracker({ courses, onUpdateCourse }: AttendanceTrackerProps) {
  const attendanceByCourse = useMemo(
    () =>
      courses.map((course) => {
        const total = course.attendanceRecords?.length || 0;
        const attended = course.attendanceRecords?.filter((r) => r.present).length || 0;
        const percentage = calculateAttendancePercentage(attended, total);
        const minRequired = course.minAttendance ?? 75;
        const status = getAttendanceStatus(percentage, minRequired);

        return { course, total, attended, percentage, minRequired, status };
      }),
    [courses],
  );

  const handleMarkAttendance = (courseId: string, attended: boolean) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    onUpdateCourse(courseId, {
      attendanceRecords: [...(course.attendanceRecords || []), { date: new Date(), present: attended }],
    });
  };

  return (
    <div className="space-y-4">
      {attendanceByCourse.map(({ course, total, attended, percentage, minRequired, status }) => {
        const StatusIcon = status.icon;
        const canSkip = calculateClassesToSkip(course);
        const needToAttend = calculateClassesNeeded(course);

        return (
          <Card key={course.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <Badge variant="outline" style={{ borderColor: course.color, color: course.color }}>
                      {course.code}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {course.instructor || 'Add instructor'} • {course.credits || 0} credits
                  </CardDescription>
                </div>
                <div className={`flex items-center gap-2 ${status.color}`}>
                  <StatusIcon className="h-5 w-5" />
                  <span className="font-bold text-2xl">{percentage}%</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    {attended} / {total} classes attended
                  </span>
                  <span className="text-slate-400">Required: {minRequired}%</span>
                </div>
                <Progress
                  value={percentage}
                  indicatorClassName={percentage >= minRequired ? 'bg-emerald-500' : 'bg-red-500'}
                />
              </div>

              {course.dontForget && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-400">{course.dontForget}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleMarkAttendance(course.id, true)}
                >
                  Mark Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleMarkAttendance(course.id, false)}
                >
                  Mark Absent
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="default" className="flex-1">
                      Can I Bunk? 🤔
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle>Attendance Analysis: {course.name}</DialogTitle>
                      <DialogDescription>Let&apos;s see if you can afford to skip some classes.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Current Attendance</span>
                          <span className={`font-bold ${status.color}`}>{percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Minimum Required</span>
                          <span className="font-bold">{minRequired}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Buffer</span>
                          <span
                            className={`font-bold ${
                              percentage - minRequired >= 0 ? 'text-emerald-500' : 'text-red-500'
                            }`}
                          >
                            {percentage - minRequired > 0 ? '+' : ''}
                            {percentage - minRequired}%
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-4">
                        {percentage >= minRequired ? (
                          <div className="space-y-3">
                            <p className="text-emerald-400 font-medium mb-2">✅ You can skip:</p>
                            <p className="text-3xl font-bold text-emerald-500">
                              {canSkip} {canSkip === 1 ? 'class' : 'classes'}
                            </p>
                            <p className="text-sm text-slate-400 mt-2">
                              Without falling below {minRequired}% attendance
                            </p>
                            {canSkip > 0 && (
                              <p className="text-xs text-slate-500 text-center">
                                But remember: Attending classes = Better grades! 📚
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                              <p className="text-red-400 font-medium mb-2">⚠️ You need to attend:</p>
                              <p className="text-3xl font-bold text-red-500">
                                {needToAttend} more {needToAttend === 1 ? 'class' : 'classes'}
                              </p>
                              <p className="text-sm text-slate-400 mt-2">To reach {minRequired}% attendance</p>
                            </div>
                            <p className="text-xs text-red-400 text-center font-medium">
                              🚨 Don&apos;t skip any more classes!
                            </p>
                          </div>
                        )}
                      </div>

                      {course.schedule && course.schedule.length > 0 && (
                        <div className="border-t border-slate-800 pt-4">
                          <p className="text-sm font-medium mb-2">Class Schedule:</p>
                          <div className="space-y-1">
                            {course.schedule.map((schedule, idx) => (
                              <div key={idx} className="text-xs text-slate-400">
                                {schedule.day}: {schedule.startTime} - {schedule.endTime} ({schedule.location})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function getAttendanceStatus(percentage: number, minRequired: number) {
  if (percentage >= minRequired + 10) return { color: 'text-emerald-500', icon: CheckCircle, status: 'Safe' };
  if (percentage >= minRequired) return { color: 'text-amber-500', icon: AlertCircle, status: 'Borderline' };
  return { color: 'text-red-500', icon: AlertCircle, status: 'Critical' };
}