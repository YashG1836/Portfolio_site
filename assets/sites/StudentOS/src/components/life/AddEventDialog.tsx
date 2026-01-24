import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddEventDialogProps {
  onSave: (event: Omit<Event, 'id'>, existingId?: string) => void;
  triggerLabel?: string;
  initialEvent?: Event | null;
  onClose?: () => void;
}

const defaultEvent: Omit<Event, 'id'> = {
  title: '',
  description: '',
  type: 'personal',
  category: 'other',
  startTime: new Date(),
  endTime: new Date(),
  location: '',
  isAllDay: false,
};

export function AddEventDialog({ onSave, triggerLabel = 'Add event', initialEvent, onClose }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<Event, 'id'>>(defaultEvent);

  useEffect(() => {
    if (initialEvent && !open) {
      setOpen(true);
    }
  }, [initialEvent, open]);

  useEffect(() => {
    if (open) {
      if (initialEvent) {
        setDraft({ ...initialEvent, startTime: new Date(initialEvent.startTime), endTime: initialEvent.endTime ? new Date(initialEvent.endTime) : undefined });
      } else {
        setDraft(defaultEvent);
      }
    }
  }, [open, initialEvent]);

  const handleSave = () => {
    if (!draft.title.trim()) return;
    const start = new Date(draft.startTime);
    const end = draft.endTime ? new Date(draft.endTime) : undefined;

    onSave(
      {
        ...draft,
        startTime: start,
        endTime: end ?? start,
      },
      initialEvent?.id,
    );
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && onClose) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle>{initialEvent ? 'Edit event' : 'Add event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea value={draft.description || ''} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Start</Label>
              <Input
                type="datetime-local"
                value={toLocalInputValue(draft.startTime)}
                onChange={(e) => setDraft((d) => ({ ...d, startTime: new Date(e.target.value) }))}
              />
            </div>
            <div className="space-y-1">
              <Label>End</Label>
              <Input
                type="datetime-local"
                value={toLocalInputValue(draft.endTime || draft.startTime)}
                onChange={(e) => setDraft((d) => ({ ...d, endTime: new Date(e.target.value) }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(value) => setDraft((d) => ({ ...d, category: value as Event['category'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fest">Fest</SelectItem>
                  <SelectItem value="talk">Talk</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="viva">Viva</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select
                value={draft.type}
                onValueChange={(value) => setDraft((d) => ({ ...d, type: value as Event['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Location</Label>
            <Input value={draft.location || ''} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{initialEvent ? 'Update' : 'Save'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function toLocalInputValue(date: Date) {
  if (!date) return '';
  const d = new Date(date);
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
}
