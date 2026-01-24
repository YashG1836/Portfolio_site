import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Moon, Sun, Bell, Eye, MessageSquare, Trash2, Droplets, Shirt } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { settings, updateSettings } = useData();
  const { theme, toggleTheme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [cfHandle, setCfHandle] = useState(settings.codeforcesHandle || '');
  const [water, setWater] = useState(settings.healthTargets?.waterMl?.toString() || '2500');
  const [workouts, setWorkouts] = useState(settings.healthTargets?.workoutsPerWeek?.toString() || '3');
  const [sleep, setSleep] = useState(settings.healthTargets?.sleepHours?.toString() || '7.5');
  const [dropDays, setDropDays] = useState(formatDays(settings.laundryPlan?.dropDays));
  const [pickupDays, setPickupDays] = useState(formatDays(settings.laundryPlan?.pickupDays));
  const [returnLag, setReturnLag] = useState(settings.laundryPlan?.returnLagDays?.toString() || '2');

  function formatDays(days?: number[]) {
    if (!days || days.length === 0) return '';
    const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((d) => map[d] || '').join(', ');
  }

  function parseDays(input: string): number[] {
    if (!input) return [];
    const map: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    return input
      .split(',')
      .map((s) => s.trim().toLowerCase().slice(0, 3))
      .map((abbr) => map[abbr])
      .filter((v) => v !== undefined);
  }

  const handleClearData = () => {
    localStorage.removeItem('studentos_data');
    window.location.reload();
  };

  const handleSaveSettings = () => {
    updateSettings({
      codeforcesHandle: cfHandle.trim() || undefined,
      healthTargets: {
        waterMl: Number(water) || undefined,
        workoutsPerWeek: Number(workouts) || undefined,
        sleepHours: Number(sleep) || undefined,
      },
      laundryPlan: {
        dropDays: parseDays(dropDays),
        pickupDays: parseDays(pickupDays),
        returnLagDays: Number(returnLag) || undefined,
      },
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  useEffect(() => {
    setCfHandle(settings.codeforcesHandle || '');
    setWater(settings.healthTargets?.waterMl?.toString() || '2500');
    setWorkouts(settings.healthTargets?.workoutsPerWeek?.toString() || '3');
    setSleep(settings.healthTargets?.sleepHours?.toString() || '7.5');
    setDropDays(formatDays(settings.laundryPlan?.dropDays));
    setPickupDays(formatDays(settings.laundryPlan?.pickupDays));
    setReturnLag(settings.laundryPlan?.returnLagDays?.toString() || '2');
  }, [settings]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-slate-500/10">
          <SettingsIcon className="h-6 w-6 text-slate-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your StudentOS experience</p>
        </div>
      </div>

      {showSuccess && (
        <Card className="border-emerald-500/50 bg-emerald-500/10">
          <CardContent className="py-4">
            <p className="text-sm text-emerald-500 font-medium">✓ Settings saved successfully!</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize how StudentOS looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    settings.accentColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateSettings({ accentColor: color })}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">Show notifications within the app</p>
            </div>
            <Switch
              checked={settings.notificationPreferences.inApp}
              onCheckedChange={(checked) =>
                updateSettings({
                  notificationPreferences: {
                    ...settings.notificationPreferences,
                    inApp: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={settings.notificationPreferences.email}
              onCheckedChange={(checked) =>
                updateSettings({
                  notificationPreferences: {
                    ...settings.notificationPreferences,
                    email: checked,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Notification Intensity</Label>
            <Select
              value={settings.notificationPreferences.intensity}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                updateSettings({
                  notificationPreferences: {
                    ...settings.notificationPreferences,
                    intensity: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Only critical alerts</SelectItem>
                <SelectItem value="medium">Medium - Important updates</SelectItem>
                <SelectItem value="high">High - All notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <CardTitle>Codeforces & Integrations</CardTitle>
          </div>
          <CardDescription>Keep your handles up to date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Codeforces handle</Label>
            <Input value={cfHandle} onChange={(e) => setCfHandle(e.target.value)} placeholder="tourist" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            <CardTitle>Health targets</CardTitle>
          </div>
          <CardDescription>Daily and weekly goals</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Water (ml)</Label>
            <Input type="number" value={water} onChange={(e) => setWater(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Workouts / week</Label>
            <Input type="number" value={workouts} onChange={(e) => setWorkouts(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Sleep hours</Label>
            <Input type="number" step="0.5" value={sleep} onChange={(e) => setSleep(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            <CardTitle>Laundry schedule</CardTitle>
          </div>
          <CardDescription>Keep pickups and drops synced</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Drop days (Mon, Thu)</Label>
            <Input value={dropDays} onChange={(e) => setDropDays(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Pickup days (Tue, Fri)</Label>
            <Input value={pickupDays} onChange={(e) => setPickupDays(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Return lag (days)</Label>
            <Input type="number" value={returnLag} onChange={(e) => setReturnLag(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <CardTitle>Module Visibility</CardTitle>
          </div>
          <CardDescription>Show or hide specific modules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Academic Module</Label>
            <Switch
              checked={settings.moduleVisibility.academic}
              onCheckedChange={(checked) =>
                updateSettings({
                  moduleVisibility: {
                    ...settings.moduleVisibility,
                    academic: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Career Module</Label>
            <Switch
              checked={settings.moduleVisibility.career}
              onCheckedChange={(checked) =>
                updateSettings({
                  moduleVisibility: {
                    ...settings.moduleVisibility,
                    career: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Life Module</Label>
            <Switch
              checked={settings.moduleVisibility.life}
              onCheckedChange={(checked) =>
                updateSettings({
                  moduleVisibility: {
                    ...settings.moduleVisibility,
                    life: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle>Backlog Burner</CardTitle>
          </div>
          <CardDescription>Choose the tone for overdue task reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.backlogBurnerTone}
            onValueChange={(value: 'gentle' | 'firm' | 'savage') =>
              updateSettings({ backlogBurnerTone: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gentle">Gentle - Encouraging reminders</SelectItem>
              <SelectItem value="firm">Firm - Direct reminders</SelectItem>
              <SelectItem value="savage">Savage - Brutally honest</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your courses, tasks, habits, and
                  settings from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} className="bg-red-500 hover:bg-red-600">
                  Yes, clear all data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
    </div>
  );
}