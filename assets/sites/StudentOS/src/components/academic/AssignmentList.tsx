import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, Course } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format, differenceInDays } from 'date-fns';
import { FileText, Clock, AlertTriangle, Link2 } from 'lucide-react';

interface AssignmentListProps {
  tasks: Task[];
  courses: Course[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function AssignmentList({ tasks, courses, onUpdateTask }: AssignmentListProps) {
  const academicTasks = tasks.filter(t => 
    t.type === 'assignment' || t.type === 'quiz' || t.type === 'exam'
  );

  const getCourseById = (courseId?: string) => {
    return courses.find(c => c.id === courseId);
  };

  const getDaysUntilDue = (dueDate?: Date) => {
    if (!dueDate) return Number.POSITIVE_INFINITY;
    return differenceInDays(dueDate, new Date());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝';
      case 'quiz': return '❓';
      default: return '📄';
    }
  };

  const sortedTasks = [...academicTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <CardTitle>Assignments & Exams</CardTitle>
        </div>
        <CardDescription>Track your academic deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No assignments or exams. Enjoy the peace! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const course = getCourseById(task.courseId);
              const dueDate = task.dueDate ? new Date(task.dueDate) : undefined;
              const daysUntil = getDaysUntilDue(dueDate);
              const isOverdue = daysUntil < 0;
              const isUrgent = daysUntil <= 2 && !task.completed;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed
                      ? 'bg-slate-800/30 border-slate-800 opacity-60'
                      : isUrgent
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) =>
                        onUpdateTask(task.id, {
                          completed: checked as boolean,
                          completedAt: checked ? new Date() : undefined,
                        })
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getTypeIcon(task.type)}</span>
                            <h3 className={`font-medium ${task.completed ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </h3>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            {course && (
                              <Badge variant="outline" style={{ borderColor: course.color, color: course.color }}>
                                {course.code}
                              </Badge>
                            )}
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {task.estimatedHours && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {task.estimatedHours}h
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            isOverdue ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-slate-400'
                          }`}>
                            {isOverdue ? (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Overdue</span>
                              </div>
                            ) : daysUntil === 0 ? (
                              'Today'
                            ) : daysUntil === 1 ? (
                              'Tomorrow'
                            ) : (
                              `${daysUntil} days`
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            {dueDate ? format(dueDate, 'MMM d, yyyy') : 'No due date set'}
                            {task.attachmentUrl && (
                              <a
                                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                href={task.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Link2 className="h-3 w-3" />
                                Attachment
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}