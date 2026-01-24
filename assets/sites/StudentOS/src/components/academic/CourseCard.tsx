import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { Course } from '@/types';
import { calculateAttendancePercentage } from '@/lib/calculations';

interface CourseCardProps {
  course: Course;
  onMarkAttendance: (courseId: string, present: boolean) => void;
}

export function CourseCard({ course, onMarkAttendance }: CourseCardProps) {
  const attendancePercentage = calculateAttendancePercentage(
    course.attendanceRecords?.filter((r) => r.present).length || 0,
    course.attendanceRecords?.length || 0
  );

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-emerald-500';
    if (percentage >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const canSkip = attendancePercentage >= (course.minAttendance ?? 75);

  const readableSchedule = course.schedule
    ?.map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}${slot.location ? ` @ ${slot.location}` : ''}`)
    .join(', ');

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{course.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.code}</p>
            </div>
          </div>
          <Badge variant={course.type === 'core' ? 'default' : 'secondary'}>
            {course.type || 'course'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Attendance</span>
            <span className={`text-sm font-bold ${getAttendanceColor(attendancePercentage)}`}>
              {attendancePercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={attendancePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {course.attendanceRecords.filter((r) => r.present).length} / {course.attendanceRecords.length} classes
          </p>
        </div>

        {!canSkip && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-500">
              Attend next {Math.ceil((75 - attendancePercentage) / 5)} classes to reach 75%
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{readableSchedule || 'Add your schedule in edit'}</span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onMarkAttendance(course.id, true)}
          >
            Mark Present
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onMarkAttendance(course.id, false)}
          >
            Mark Absent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}