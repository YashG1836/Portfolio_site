import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import {
  Course,
  Task,
  Habit,
  Event,
  Contest,
  StudyTrack,
  Goal,
  StreakLog,
  UserSettings,
  Notification,
  TimetableEntry,
} from '@/types';

interface DataContextType {
  courses: Course[];
  tasks: Task[];
  habits: Habit[];
  events: Event[];
  contests: Contest[];
  studyTracks: StudyTrack[];
  goals: Goal[];
  streakLogs: StreakLog[];
  notifications: Notification[];
  timetable: TimetableEntry[];
  settings: UserSettings;
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Omit<Course, 'id' | 'attendanceRecords'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => void;
  deleteTask: (id: string) => void;
  deleteHabit: (id: string) => void;
  markHabitComplete: (id: string, date: Date) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to convert date strings to Date objects
function parseDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Check if string is a date
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (dateRegex.test(obj)) {
      return new Date(obj) as T;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => parseDates(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const parsed: Record<string, unknown> = {};
    for (const key in obj) {
      parsed[key] = parseDates(obj[key]);
    }
    return parsed as T;
  }
  
  return obj;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [studyTracks, setStudyTracks] = useState<StudyTrack[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streakLogs, setStreakLogs] = useState<StreakLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    accentColor: '#3B82F6',
    notificationPreferences: {
      inApp: true,
      email: false,
      intensity: 'medium',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    },
    moduleVisibility: {
      academic: true,
      career: true,
      life: true,
    },
    backlogBurnerTone: 'firm',
    laundryPlan: {
      dropDays: [],
      pickupDays: [],
    },
  });
  const reminderState = useRef<{ tasks: Record<string, { soon?: boolean; overdue?: boolean }>; laundry: Record<string, boolean>; events: Record<string, boolean> }>({ tasks: {}, laundry: {}, events: {} });

  useEffect(() => {
    // Load data from localStorage or start fresh
    const storedData = localStorage.getItem('studentos_data');
    if (storedData) {
      const data = JSON.parse(storedData);
      setCourses(normalizeCourses(parseDates<Course[]>(data.courses || [])));
      setTasks(normalizeTasks(parseDates<Task[]>(data.tasks || [])));
      setHabits(parseDates<Habit[]>(data.habits || []));
      setEvents(parseDates<Event[]>(data.events || []));
      setContests(normalizeContests(parseDates<Contest[]>(data.contests || [])));
      setTimetable(parseDates<TimetableEntry[]>(data.timetable || []));
      setStudyTracks(parseDates<StudyTrack[]>(data.studyTracks || []));
      setGoals(parseDates<Goal[]>(data.goals || []));
      setStreakLogs(parseDates<StreakLog[]>(data.streakLogs || []));
      setNotifications(parseDates<Notification[]>(data.notifications || []));
      if (data.settings)
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
          laundryPlan: normalizeLaundry(data.settings.laundryPlan),
        }));
      setHydrated(true);
    } else {
      // Start with clean slate; onboarding will populate
      setCourses([]);
      setTasks([]);
      setHabits([]);
      setEvents([]);
      setContests([]);
      setStudyTracks([]);
      setGoals([]);
      setStreakLogs([]);
      setNotifications([]);
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return; // prevent overwriting stored data before hydration

    // Save data to localStorage whenever it changes
    const data = {
      courses,
      tasks,
      habits,
      events,
      contests,
      studyTracks,
      goals,
      streakLogs,
      notifications,
      timetable,
      settings,
    };
    localStorage.setItem('studentos_data', JSON.stringify(data));
  }, [hydrated, courses, tasks, habits, events, contests, studyTracks, goals, streakLogs, notifications, timetable, settings]);

  // Lightweight reminder engine (in-app toasts)
  useEffect(() => {
    if (!settings.notificationPreferences.inApp) return;

    const checkReminders = () => {
      const now = new Date();

      // Task deadline reminders
      tasks.forEach((task) => {
        if (task.completed || !task.dueDate) return;
        const diffMs = task.dueDate.getTime() - now.getTime();
        const entry = reminderState.current.tasks[task.id] || {};

        if (diffMs <= 90 * 60 * 1000 && diffMs > 0 && !entry.soon) {
          toast(`⏰ ${task.title}`, {
            description: 'Due within 90 minutes. Take action now.',
          });
          addNotification({
            title: 'Task due soon',
            message: `${task.title} is due within 90 minutes`,
            type: 'warning',
            actionLink: '/tasks',
          });
          reminderState.current.tasks[task.id] = { ...entry, soon: true };
        }

        if (diffMs < 0 && !entry.overdue) {
          toast(`⚠️ ${task.title}`, {
            description: 'This task is overdue. Finish it ASAP.',
          });
          addNotification({
            title: 'Task overdue',
            message: `${task.title} is overdue. Finish it now.`,
            type: 'error',
            actionLink: '/tasks',
          });
          reminderState.current.tasks[task.id] = { ...entry, overdue: true };
        }
      });

      // Event reminders
      events.forEach((event) => {
        if (!event.startTime) return;
        const days = differenceInCalendarDays(event.startTime, now);
        const key = event.id;
        if ((days === 0 || days === 1) && !reminderState.current.events[key]) {
          toast(`📅 ${event.title}`, {
            description: days === 0 ? 'Happening today' : 'Happening tomorrow',
          });
          addNotification({
            title: 'Event reminder',
            message: `${event.title} ${days === 0 ? 'is today' : 'is tomorrow'}.`,
            type: 'info',
            actionLink: '/life',
          });
          reminderState.current.events[key] = true;
        }
      });

      // Laundry reminders
      const plan = settings.laundryPlan;
      if (plan?.dropDays?.length) {
        const nextDrop = getNextOccurrence(plan.dropDays);
        if (nextDrop !== null) {
          const days = differenceInCalendarDays(nextDrop, now);
          const key = `drop-${nextDrop.toDateString()}`;
          if (days === 1 && !reminderState.current.laundry[key]) {
            toast('🧺 Laundry drop tomorrow', {
              description: 'Bag your clothes tonight so you do not miss pickup.',
            });
            reminderState.current.laundry[key] = true;
          }
        }
      }

      if (plan?.pickupDays?.length) {
        const nextPickup = getNextOccurrence(plan.pickupDays);
        if (nextPickup !== null) {
          const days = differenceInCalendarDays(nextPickup, now);
          const key = `pickup-${nextPickup.toDateString()}`;
          if (days === 1 && !reminderState.current.laundry[key]) {
            toast('🧺 Laundry pickup tomorrow', {
              description: 'Be home and keep tokens ready for collection.',
            });
            reminderState.current.laundry[key] = true;
          }
        }
      }
    };

    const id = setInterval(checkReminders, 60 * 1000);
    checkReminders();
    return () => clearInterval(id);
  }, [tasks, events, settings.notificationPreferences.inApp, settings.laundryPlan, reminderState]);

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const setCoursesDirect = (incoming: Course[]) => {
    setCourses(normalizeCourses(incoming));
  };

  const addCourse = (course: Omit<Course, 'id' | 'attendanceRecords'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      attendanceRecords: [],
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    addNotification({
      title: 'New task added',
      message: newTask.title,
      type: 'info',
      actionLink: '/tasks',
    });
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    addNotification({
      title: 'Event added',
      message: newEvent.title,
      type: 'info',
      actionLink: '/life',
    });
  };

  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = { ...entry, id: Date.now().toString() };
    setTimetable((prev) => [...prev.filter((e) => !(e.day === newEntry.day && e.start === newEntry.start)), newEntry]);
  };

  const updateTimetableEntry = (id: string, updates: Partial<TimetableEntry>) => {
    setTimetable((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const markHabitComplete = (id: string, date: Date) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const completedDates = [...h.completedDates, date];
          const currentStreak = calculateStreak(completedDates);
          return {
            ...h,
            completedDates,
            currentStreak,
            longestStreak: Math.max(h.longestStreak, currentStreak),
          };
        }
        return h;
      })
    );
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => [
      {
        ...notification,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        read: false,
      },
      ...prev,
    ].slice(0, 50));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        tasks,
        habits,
        events,
        contests,
        studyTracks,
        goals,
        streakLogs,
        notifications,
        timetable,
        settings,
        setCourses: setCoursesDirect,
        addCourse,
        updateCourse,
        updateTask,
        addEvent,
        updateEvent,
        deleteEvent,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        updateHabit,
        addTask,
        addHabit,
        deleteTask,
        deleteHabit,
        markHabitComplete,
        updateSettings,
        addNotification,
        markAllNotificationsRead,
        markNotificationRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.floor((sortedDates[i].getTime() - sortedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function normalizeCourses(courses: Course[]): Course[] {
  return courses.map((course) => ({
    attendanceRecords: [],
    ...course,
    attendanceRecords: course.attendanceRecords ?? [],
  }));
}

function normalizeTasks(tasks: Task[]): Task[] {
  return tasks.map((task) => ({
    category: task.category ?? 'other',
    ...task,
  }));
}

function normalizeContests(contests: Contest[]): Contest[] {
  return contests.map((c) => ({
    ...c,
    startTime: new Date(c.startTime),
  }));
}

function normalizeLaundry(plan?: UserSettings['laundryPlan']): UserSettings['laundryPlan'] {
  if (!plan) return { dropDays: [], pickupDays: [] };
  return {
    dropDays: plan.dropDays ?? [],
    pickupDays: plan.pickupDays ?? [],
    returnLagDays: plan.returnLagDays,
  };
}

function getNextOccurrence(days: number[]): Date | null {
  if (!days || days.length === 0) return null;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const candidate = addDays(today, i);
    if (days.includes(candidate.getDay())) {
      return candidate;
    }
  }
  return null;
}