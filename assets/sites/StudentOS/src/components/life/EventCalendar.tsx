import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Pencil, Trash2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface EventCalendarProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export function EventCalendar({ events, onEdit, onDelete }: EventCalendarProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fest': return 'bg-purple-500';
      case 'talk': return 'bg-blue-500';
      case 'exam': return 'bg-red-500';
      case 'viva': return 'bg-orange-500';
      case 'presentation': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const safeEvents = events
    .filter((e) => e.startTime)
    .map((e) => ({
      ...e,
      startTime: new Date(e.startTime),
      endTime: e.endTime ? new Date(e.endTime) : undefined,
    }));

  const sortedEvents = [...safeEvents].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const upcomingEvents = sortedEvents.filter((e) => !isPast(e.endTime ?? e.startTime));
  const pastEvents = sortedEvents.filter((e) => isPast(e.endTime ?? e.startTime));

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <CardTitle>Upcoming Events</CardTitle>
          </div>
          <CardDescription>Don't miss out on these events</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No upcoming events. All clear! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge variant="outline" className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                        {event.type === 'global' && (
                          <Badge variant="outline" className="bg-blue-500">
                            Global
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-slate-400 mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getDateLabel(event.startTime)}</span>
                        </div>
                        {!event.isAllDay && (
                          <span>{format(event.startTime, 'h:mm a')}</span>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Past Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pastEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-800 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {format(event.startTime, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge variant="outline" className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}