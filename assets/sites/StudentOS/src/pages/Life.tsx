import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { HabitTracker } from '@/components/life/HabitTracker';
import { EventCalendar } from '@/components/life/EventCalendar';
import { AddHabitDialog } from '@/components/life/AddHabitDialog';
import { AddEventDialog } from '@/components/life/AddEventDialog';
import { LaundryPanel } from '@/components/life/LaundryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart } from 'lucide-react';
import { Event } from '@/types';

export default function Life() {
  const { habits, events, addHabit, addEvent, updateEvent, deleteEvent } = useData();
  const [activeTab, setActiveTab] = useState('habits');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-pink-500/10">
            <Heart className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Life Support</h1>
            <p className="text-muted-foreground">Build healthy habits and manage personal events</p>
          </div>
        </div>
        {activeTab === 'habits' && <AddHabitDialog onAdd={addHabit} />}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="habits">Habits ({habits.length})</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="laundry">Laundry</TabsTrigger>
        </TabsList>

        <TabsContent value="habits">
          <HabitTracker />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <AddEventDialog
              onSave={(event, existingId) => {
                if (existingId) {
                  updateEvent(existingId, event);
                } else {
                  addEvent(event);
                }
                setEditingEvent(null);
              }}
              triggerLabel={editingEvent ? 'Edit event' : 'Add event'}
              initialEvent={editingEvent}
              onClose={() => setEditingEvent(null)}
            />
          </div>
          <EventCalendar
            events={events}
            onEdit={(event) => setEditingEvent(event)}
            onDelete={deleteEvent}
          />
        </TabsContent>

        <TabsContent value="laundry">
          <LaundryPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}