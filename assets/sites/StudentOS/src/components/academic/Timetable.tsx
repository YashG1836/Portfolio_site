import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TimetableEntry, Course } from '@/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_TO_INDEX = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 } as const;

// 8:30 to 18:30 in 90-min blocks, skipping 13:00-14:00 lunch
const SLOT_STARTS = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];

interface TimetableProps {
  entries: TimetableEntry[];
  courses: Course[];
  onSave: (entry: Omit<TimetableEntry, 'id'>, existingId?: string) => void;
  onDelete: (id: string) => void;
}

export function Timetable({ entries, courses, onSave, onDelete }: TimetableProps) {
  const [draft, setDraft] = useState<Omit<TimetableEntry, 'id'>>({
    day: 1,
    start: '08:30',
    end: '10:00',
    title: '',
    type: 'lecture',
    location: '',
    courseId: undefined,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const grid = useMemo(() => {
    const map: Record<string, TimetableEntry> = {};
    entries.forEach((e) => {
      if (e.day >= 1 && e.day <= 5) {
        map[`${e.day}-${e.start}`] = e;
      }
    });
    return map;
  }, [entries]);

  const openEditor = (day: number, start: string) => {
    const existing = grid[`${day}-${start}`];
    if (existing) {
      setDraft({ ...existing, title: existing.title || '', location: existing.location || '', courseId: existing.courseId });
      setEditingId(existing.id);
    } else {
      const end = nextSlot(start);
      setDraft({ day, start, end, title: '', type: 'lecture', location: '', courseId: undefined });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!draft.title.trim() || !draft.type || !draft.location.trim()) {
      return;
    }
    onSave(
      { ...draft, title: draft.title.trim(), location: draft.location.trim() },
      editingId || undefined,
    );
    setOpen(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <div className="grid" style={{ gridTemplateColumns: `120px repeat(${DAYS.length}, 1fr)` }}>
            <div className="p-2 text-sm text-slate-400">Time</div>
            {DAYS.map((d) => (
              <div key={d} className="p-2 text-center font-medium text-slate-200">{d}</div>
            ))}

            {SLOT_STARTS.map((start) => {
              const end = nextSlot(start);
              if (start === '13:00') {
                // lunch break block
                return (
                  <div key={`row-${start}`} className="contents">
                    <div key={`label-${start}`} className="p-2 text-xs text-slate-400 border-t border-slate-800">
                      {start} - {end} (Lunch)
                    </div>
                    {DAYS.map((d) => (
                      <div
                        key={`${d}-${start}`}
                        className="border border-slate-800 bg-slate-900/60 text-xs text-slate-500 flex items-center justify-center"
                      >
                        Break
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div key={`row-${start}`} className="contents">
                  <div key={`label-${start}`} className="p-2 text-xs text-slate-400 border-t border-slate-800">
                    {start} - {end}
                  </div>
                  {DAYS.map((d) => {
                    const dayIdx = DAY_TO_INDEX[d as keyof typeof DAY_TO_INDEX];
                    const entry = grid[`${dayIdx}-${start}`];
                    return (
                      <button
                        key={`${d}-${start}`}
                        type="button"
                        className="text-left border border-slate-800 bg-slate-900/60 min-h-[96px] p-2 hover:border-slate-600 cursor-pointer w-full h-full"
                        onClick={() => openEditor(dayIdx, start)}
                      >
                        {entry ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-sm leading-tight text-slate-100 truncate">{entry.title}</div>
                              <Badge variant="outline" className="text-[10px] px-1">
                                {entry.type}
                              </Badge>
                            </div>
                            {entry.location && <div className="text-xs text-slate-400">{entry.location}</div>}
                            {entry.courseId && <div className="text-[10px] text-slate-500">{courseName(entry.courseId, courses)}</div>}
                            <div className="text-[10px] text-slate-500">{entry.start} - {entry.end}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 flex items-center justify-center h-full">Click to add</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit slot' : 'Add slot'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Day</Label>
                <Select
                  value={draft.day.toString()}
                  onValueChange={(v) => setDraft((d) => ({ ...d, day: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mon</SelectItem>
                    <SelectItem value="2">Tue</SelectItem>
                    <SelectItem value="3">Wed</SelectItem>
                    <SelectItem value="4">Thu</SelectItem>
                    <SelectItem value="5">Fri</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select
                  value={draft.type}
                  onValueChange={(v) => setDraft((d) => ({ ...d, type: v as TimetableEntry['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start</Label>
                <Select value={draft.start} onValueChange={(v) => setDraft((d) => ({ ...d, start: v, end: nextSlot(v) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SLOT_STARTS.filter((s) => s !== '13:00').map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>End</Label>
                <Input value={draft.end} disabled />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Course name</Label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="e.g. Data Structures" />
            </div>

            <div className="space-y-1">
              <Label>Session type</Label>
              <Select
                value={draft.type}
                onValueChange={(v) => setDraft((d) => ({ ...d, type: v as TimetableEntry['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lecture / Tutorial / Lab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Classroom / Lab no.</Label>
              <Input
                value={draft.location || ''}
                onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                placeholder="e.g. Room 302"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              {editingId && (
                <Button variant="destructive" onClick={() => { onDelete(editingId); setOpen(false); }}>
                  Delete slot
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function nextSlot(start: string) {
  const idx = SLOT_STARTS.indexOf(start);
  return SLOT_STARTS[idx + 1] || '18:30';
}

function courseName(id: string, courses: Course[]) {
  return courses.find((c) => c.id === id)?.name || '';
}
