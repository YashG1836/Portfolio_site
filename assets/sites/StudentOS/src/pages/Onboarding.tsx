import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Rocket } from 'lucide-react';
import { Course } from '@/types';

interface CourseDraft {
  name: string;
  code: string;
  minAttendance: number;
  color?: string;
  type?: 'core' | 'elective';
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setCourses, updateSettings } = useData();

  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [waterMl, setWaterMl] = useState('2500');
  const [workouts, setWorkouts] = useState('3');
  const [sleep, setSleep] = useState('7.5');
  const [dropDays, setDropDays] = useState('Mon, Thu');
  const [pickupDays, setPickupDays] = useState('Tue, Fri');
  const [returnLag, setReturnLag] = useState('2');
  const [coursesDraft, setCoursesDraft] = useState<CourseDraft[]>([
    { name: '', code: '', minAttendance: 75, type: 'core' },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const parseDays = (input: string): number[] => {
    const map: Record<string, number> = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };
    return input
      .split(',')
      .map((s) => s.trim().toLowerCase().slice(0, 3))
      .map((abbr) => map[abbr])
      .filter((v) => v !== undefined);
  };

  const handleAddCourse = () => {
    setCoursesDraft((prev) => [...prev, { name: '', code: '', minAttendance: 75, type: 'core' }]);
  };

  const handleCourseChange = (index: number, field: keyof CourseDraft, value: string) => {
    setCoursesDraft((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: field === 'minAttendance' ? Number(value) : value } as CourseDraft;
      return next;
    });
  };

  const handleRemoveCourse = (index: number) => {
    setCoursesDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setIsSaving(true);

    const filteredCourses = coursesDraft
      .filter((c) => c.name.trim().length > 0)
      .map<Course>((c, idx) => ({
        id: `${Date.now()}-${idx}`,
        name: c.name.trim(),
        code: c.code.trim() || `COURSE-${idx + 1}`,
        minAttendance: c.minAttendance,
        type: c.type,
        attendanceRecords: [],
      }));

    setCourses(filteredCourses);

    updateSettings({
      codeforcesHandle: codeforcesHandle.trim() || undefined,
      healthTargets: {
        waterMl: Number(waterMl) || undefined,
        workoutsPerWeek: Number(workouts) || undefined,
        sleepHours: Number(sleep) || undefined,
      },
      laundryPlan: {
        dropDays: parseDays(dropDays),
        pickupDays: parseDays(pickupDays),
        returnLagDays: Number(returnLag) || undefined,
      },
    });

    setTimeout(() => {
      setIsSaving(false);
      navigate('/');
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-blue-500/10">
          <Rocket className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Set up your StudentOS</h1>
          <p className="text-muted-foreground">Tell us about your courses, Codeforces handle, health targets, and laundry loop.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="life">Life & Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Programming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Codeforces handle</Label>
              <Input
                placeholder="tourist"
                value={codeforcesHandle}
                onChange={(e) => setCodeforcesHandle(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">We'll fetch rating and upcoming contests once saved.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {coursesDraft.map((course, idx) => (
            <Card key={idx} className="bg-slate-900/60 border-slate-800">
              <CardContent className="pt-6 space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Course name</Label>
                    <Input
                      value={course.name}
                      onChange={(e) => handleCourseChange(idx, 'name', e.target.value)}
                      placeholder="Operating Systems"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                      value={course.code}
                      onChange={(e) => handleCourseChange(idx, 'code', e.target.value)}
                      placeholder="CS304"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum attendance %</Label>
                    <Input
                      type="number"
                      min={50}
                      max={100}
                      value={course.minAttendance}
                      onChange={(e) => handleCourseChange(idx, 'minAttendance', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Mark classes from dashboard later.</span>
                  {coursesDraft.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCourse(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full" onClick={handleAddCourse}>
            <Plus className="h-4 w-4 mr-2" /> Add another course
          </Button>
        </TabsContent>

        <TabsContent value="life" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health targets</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Daily water (ml)</Label>
                <Input value={waterMl} onChange={(e) => setWaterMl(e.target.value)} type="number" min={500} />
              </div>
              <div className="space-y-2">
                <Label>Workouts / week</Label>
                <Input value={workouts} onChange={(e) => setWorkouts(e.target.value)} type="number" min={0} />
              </div>
              <div className="space-y-2">
                <Label>Sleep target (hours)</Label>
                <Input value={sleep} onChange={(e) => setSleep(e.target.value)} type="number" step="0.5" min={0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laundry loop</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Drop days (comma separated)</Label>
                <Input value={dropDays} onChange={(e) => setDropDays(e.target.value)} placeholder="Mon, Thu" />
                <p className="text-xs text-muted-foreground">Example: Mon, Thu</p>
              </div>
              <div className="space-y-2">
                <Label>Pickup days (comma separated)</Label>
                <Input value={pickupDays} onChange={(e) => setPickupDays(e.target.value)} placeholder="Tue, Fri" />
                <p className="text-xs text-muted-foreground">Example: Tue, Fri</p>
              </div>
              <div className="space-y-2">
                <Label>Return lag (days)</Label>
                <Input value={returnLag} onChange={(e) => setReturnLag(e.target.value)} type="number" min={1} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/')}>Skip for now</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save & continue'}
        </Button>
      </div>
    </div>
  );
}
