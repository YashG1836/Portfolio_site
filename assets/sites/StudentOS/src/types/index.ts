export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'admin';
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  credits?: number;
  color?: string;
  minAttendance?: number; // percentage target
  schedule?: ClassSchedule[];
  type?: 'core' | 'elective';
  attendanceRecords: AttendanceEntry[];
  dontForget?: string;
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: Date;
  attended: boolean;
  isCritical: boolean;
}

export interface AttendanceEntry {
  date: Date;
  present: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'assignment' | 'quiz' | 'exam' | 'upsolve' | 'chore' | 'todo';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  completed: boolean;
  courseId?: string;
  contestId?: string;
  estimatedHours?: number;
  attachmentUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  category?: 'academic' | 'career' | 'life' | 'other';
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'annual' | 'vacation';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export interface StudyTrack {
  id: string;
  name: string;
  description?: string;
  type: 'cp' | 'ml' | 'web' | 'other';
  totalItems: number;
  completedItems: number;
  link?: string;
}

export interface Contest {
  id: string;
  name: string;
  platform: 'codeforces' | 'codechef' | 'atcoder' | 'leetcode';
  startTime: Date;
  duration: number; // minutes
  registered: boolean;
  participated: boolean;
  rank?: number;
  problemsSolved?: number;
  url?: string;
}

export interface UpsolveItem {
  id: string;
  contestId: string;
  problemName: string;
  problemLink: string;
  difficulty: string;
  tags: string[];
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number[]; // 0-6 for weekly
  currentStreak: number;
  longestStreak: number;
  completedDates: Date[];
  category?: 'health' | 'career' | 'academic' | 'life';
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  type: 'reminder' | 'recurring';
  frequency: 'daily' | 'weekly' | 'monthly';
  time?: string;
  daysOfWeek?: number[];
  lastCompleted?: Date;
  nextDue: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'global' | 'personal';
  category: 'fest' | 'talk' | 'exam' | 'viva' | 'presentation' | 'other';
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  actionLink?: string;
}

export interface StreakLog {
  date: Date;
  activityCount: number;
  tasksCompleted: number;
  classesAttended: number;
  habitsCompleted: number;
  problemsSolved: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  notificationPreferences: {
    inApp: boolean;
    email: boolean;
    intensity: 'low' | 'medium' | 'high';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  moduleVisibility: {
    academic: boolean;
    career: boolean;
    life: boolean;
  };
  backlogBurnerTone: 'gentle' | 'firm' | 'savage';
  codeforcesHandle?: string;
  healthTargets?: {
    waterMl?: number;
    workoutsPerWeek?: number;
    sleepHours?: number;
  };
  laundryPlan?: {
    dropDays?: number[];
    pickupDays?: number[];
    returnLagDays?: number;
  };
}

export interface TimetableEntry {
  id: string;
  day: number; // 0=Sun ... 6=Sat
  start: string; // HH:MM 24h
  end: string;   // HH:MM 24h
  title: string;
  type: 'lecture' | 'tutorial' | 'lab' | 'other';
  location?: string;
  courseId?: string;
}

export interface BrainBandwidth {
  totalLoad: number;
  maxLoad: number;
  breakdown: {
    classes: number;
    assignments: number;
    exams: number;
    contests: number;
    habits: number;
    events: number;
  };
}