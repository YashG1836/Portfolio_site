import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Task } from '@/types';

interface AddTaskDialogProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  courses: Array<{ id: string; name: string }>;
  defaultCategory?: 'academic' | 'career' | 'life' | 'other';
  defaultType?: Task['type'];
  defaultCourseId?: string;
  triggerLabel?: string;
}

export function AddTaskDialog({ onAdd, courses, defaultCategory = 'other', defaultType = 'todo', defaultCourseId = '', triggerLabel = 'Add Task' }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'academic' | 'career' | 'life' | 'other'>(defaultCategory);
  const [taskType, setTaskType] = useState<Task['type']>(defaultType);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [courseId, setCourseId] = useState(defaultCourseId);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const resetState = () => {
    setTitle('');
    setDescription('');
    setCategory(defaultCategory);
    setTaskType(defaultType);
    setPriority('medium');
    setDueDate('');
    setCourseId(defaultCourseId);
    setAttachmentUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const parsedDate = dueDate ? new Date(`${dueDate}T23:59:00`) : undefined;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      type: taskType,
      category,
      priority,
      dueDate: parsedDate,
      courseId: courseId || undefined,
      attachmentUrl: attachmentUrl.trim() || undefined,
      completed: false,
    });

    // Reset form
    resetState();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => {
      setOpen(next);
      if (next) {
        resetState();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: 'academic' | 'career' | 'life' | 'other') => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={taskType}
                onValueChange={(value: 'assignment' | 'quiz' | 'exam' | 'upsolve' | 'chore' | 'todo') => setTaskType(value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="upsolve">Upsolve</SelectItem>
                  <SelectItem value="chore">Chore</SelectItem>
                  <SelectItem value="todo">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {taskType === 'assignment' && (
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment link (Drive/URL)</Label>
              <Input
                id="attachment"
                type="url"
                placeholder="https://drive.google.com/..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>
          )}

          {category === 'academic' && courses.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="course">Course (Optional)</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}