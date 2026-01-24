import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { AttendanceTracker } from '@/components/academic/AttendanceTracker';
import { AssignmentList } from '@/components/academic/AssignmentList';
import { CourseCard } from '@/components/academic/CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { BookOpen } from 'lucide-react';
import { Timetable } from '@/components/academic/Timetable';

export default function Academic() {
  const { courses, updateCourse, updateTask, tasks, addTask, timetable, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = useData();
  const [activeTab, setActiveTab] = useState('courses');

  const handleMarkAttendance = (courseId: string, present: boolean) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const newRecord = {
      date: new Date(),
      present,
    };

    updateCourse(courseId, {
      attendanceRecords: [...course.attendanceRecords, newRecord],
    });
  };

  const academicTasks = tasks.filter((t) => t.category === 'academic' && !t.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-purple-500/10">
          <BookOpen className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Academic Survivor</h1>
          <p className="text-muted-foreground">Track attendance, assignments, and exams</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assignments">
            Assignments {academicTasks.length > 0 && `(${academicTasks.length})`}
          </TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTracker courses={courses} onUpdateCourse={updateCourse} />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-end">
            <AddTaskDialog
              onAdd={addTask}
              courses={courses.map((c) => ({ id: c.id, name: c.name }))}
              defaultCategory="academic"
              defaultType="assignment"
              triggerLabel="Add assignment"
            />
          </div>
          <AssignmentList tasks={tasks} courses={courses} onUpdateTask={updateTask} />
        </TabsContent>

        <TabsContent value="timetable">
          <Timetable
            entries={timetable}
            courses={courses}
            onSave={(entry, existingId) => {
              if (existingId) {
                updateTimetableEntry(existingId, entry);
              } else {
                addTimetableEntry(entry);
              }
            }}
            onDelete={deleteTimetableEntry}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}