import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { WashingMachine } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { addDays, differenceInCalendarDays } from 'date-fns';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function LaundryPanel() {
  const { settings, updateSettings } = useData();
  const [dropDaysText, setDropDaysText] = useState(settings.laundryPlan?.dropDays?.map(mapDayToText).join(', ') || '');
  const [pickupDaysText, setPickupDaysText] = useState(settings.laundryPlan?.pickupDays?.map(mapDayToText).join(', ') || '');
  const [returnLag, setReturnLag] = useState(settings.laundryPlan?.returnLagDays?.toString() || '2');
  const [saving, setSaving] = useState(false);

  const nextDrop = getNextOccurrence(settings.laundryPlan?.dropDays || []);
  const nextPickup = getNextOccurrence(settings.laundryPlan?.pickupDays || []);

  const handleSave = () => {
    setSaving(true);
    updateSettings({
      laundryPlan: {
        dropDays: parseDays(dropDaysText),
        pickupDays: parseDays(pickupDaysText),
        returnLagDays: Number(returnLag) || undefined,
      },
    });
    setTimeout(() => setSaving(false), 300);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <WashingMachine className="h-5 w-5 text-blue-400" />
          <CardTitle>Laundry Loop</CardTitle>
        </div>
        <CardDescription>Auto reminders for drop and pickup days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Drop days</Label>
            <Input
              value={dropDaysText}
              onChange={(e) => setDropDaysText(e.target.value)}
              placeholder="Mon, Thu"
            />
            <p className="text-xs text-muted-foreground">Comma separated: Mon, Thu</p>
          </div>
          <div className="space-y-2">
            <Label>Pickup days</Label>
            <Input
              value={pickupDaysText}
              onChange={(e) => setPickupDaysText(e.target.value)}
              placeholder="Tue, Fri"
            />
            <p className="text-xs text-muted-foreground">Comma separated: Tue, Fri</p>
          </div>
          <div className="space-y-2">
            <Label>Return lag (days)</Label>
            <Input
              type="number"
              min={1}
              value={returnLag}
              onChange={(e) => setReturnLag(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
            <p className="text-slate-400">Next drop</p>
            <p className="text-lg font-semibold">{nextDrop ? formatDay(nextDrop) : 'Set drop days'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
            <p className="text-slate-400">Next pickup</p>
            <p className="text-lg font-semibold">{nextPickup ? formatDay(nextPickup) : 'Set pickup days'}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save schedule'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function parseDays(input: string): number[] {
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
}

function getNextOccurrence(days: number[]): Date | null {
  if (!days || days.length === 0) return null;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const candidate = addDays(today, i);
    if (days.includes(candidate.getDay())) return candidate;
  }
  return null;
}

function formatDay(date: Date): string {
  const diff = differenceInCalendarDays(date, new Date());
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `${dayNames[date.getDay()]}, ${date.toLocaleDateString()}`;
}

function mapDayToText(day: number): string {
  return dayNames[day] || '';
}
