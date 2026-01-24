import { Course, Task, Event, Contest, Habit, BrainBandwidth } from '@/types';
import { isSameDay, isAfter, isBefore, addDays } from 'date-fns';

export function calculateAttendancePercentage(attended: number, total: number): number {
  if (!total) return 0;
  return Math.round((attended / total) * 100);
}

export function calculateClassesToSkip(course: Course): number {
  const total = course.attendanceRecords?.length || 0;
  const attended = course.attendanceRecords?.filter((r) => r.present).length || 0;
  const minAttendance = course.minAttendance ?? 75;
  const currentPercentage = calculateAttendancePercentage(attended, total);
  if (currentPercentage <= minAttendance) return 0;

  let classesToSkip = 0;
  let runningAttended = attended;
  let runningTotal = total;

  while (true) {
    const newPercentage = calculateAttendancePercentage(runningAttended, runningTotal + 1);
    if (newPercentage >= minAttendance) {
      classesToSkip++;
      runningTotal++;
    } else {
      break;
    }
  }

  return classesToSkip;
}

export function calculateClassesNeeded(course: Course): number {
  const total = course.attendanceRecords?.length || 0;
  let attended = course.attendanceRecords?.filter((r) => r.present).length || 0;
  const minAttendance = course.minAttendance ?? 75;
  const currentPercentage = calculateAttendancePercentage(attended, total);
  if (currentPercentage >= minAttendance) return 0;

  let classesNeeded = 0;
  let runningTotal = total;

  while (true) {
    attended++;
    runningTotal++;
    classesNeeded++;
    const newPercentage = calculateAttendancePercentage(attended, runningTotal);
    if (newPercentage >= minAttendance) {
      break;
    }
  }

  return classesNeeded;
}

export function calculateBrainBandwidth(
  tasks: Task[],
  events: Event[],
  contests: Contest[],
  habits: Habit[],
  courses: Course[]
): BrainBandwidth {
  const today = new Date();
  const next7Days = addDays(today, 7);

  // Filter items for next 7 days
  const upcomingTasks = tasks.filter(
    (t) => !t.completed && t.dueDate && isAfter(t.dueDate, today) && isBefore(t.dueDate, next7Days)
  );
  const upcomingEvents = events.filter(
    (e) => isAfter(e.startTime, today) && isBefore(e.startTime, next7Days)
  );
  const upcomingContests = contests.filter(
    (c) => !c.participated && isAfter(c.startTime, today) && isBefore(c.startTime, next7Days)
  );

  // Calculate load based on priority and estimated hours
  const classesLoad = courses.length * 2; // 2 points per course per day
  let assignmentsLoad = 0;
  let examsLoad = 0;
  const contestsLoad = upcomingContests.length * 3; // 3 points per contest
  const habitsLoad = habits.length * 1; // 1 point per habit per day
  const eventsLoad = upcomingEvents.length * 2; // 2 points per event

  upcomingTasks.forEach((task) => {
    const priorityWeight = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };
    const weight = priorityWeight[task.priority];
    const hours = task.estimatedHours || 2;

    if (task.type === 'exam') {
      examsLoad += weight * hours;
    } else {
      assignmentsLoad += weight * hours;
    }
  });

  const totalLoad = classesLoad + assignmentsLoad + examsLoad + contestsLoad + habitsLoad + eventsLoad;
  const maxLoad = 100; // Arbitrary max for visualization

  return {
    totalLoad: Math.min(totalLoad, maxLoad),
    maxLoad,
    breakdown: {
      classes: classesLoad,
      assignments: assignmentsLoad,
      exams: examsLoad,
      contests: contestsLoad,
      habits: habitsLoad,
      events: eventsLoad,
    },
  };
}

export function detectConflicts(
  tasks: Task[],
  events: Event[],
  contests: Contest[]
): Array<{ type: string; items: string[]; date: Date }> {
  const conflicts: Array<{ type: string; items: string[]; date: Date }> = [];
  const today = new Date();

  // Check for same-day conflicts
  const allItems: Array<{ name: string; date: Date; type: string }> = [
    ...tasks
      .filter((t) => !t.completed && t.dueDate)
      .map((t) => ({ name: t.title, date: t.dueDate as Date, type: 'task' })),
    ...events.map((e) => ({ name: e.title, date: e.startTime, type: 'event' })),
    ...contests.filter((c) => !c.participated).map((c) => ({ name: c.name, date: c.startTime, type: 'contest' })),
  ];

  const dateMap = new Map<string, Array<{ name: string; type: string }>>();

  allItems.forEach((item) => {
    if (isAfter(item.date, today)) {
      const dateKey = item.date.toDateString();
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push({ name: item.name, type: item.type });
    }
  });

  dateMap.forEach((items, dateKey) => {
    if (items.length > 2) {
      conflicts.push({
        type: 'overload',
        items: items.map((i) => i.name),
        date: new Date(dateKey),
      });
    }
  });

  return conflicts;
}

export function getBacklogTasks(tasks: Task[], tone: 'gentle' | 'firm' | 'savage'): Task[] {
  const today = new Date();
  const backlogTasks = tasks.filter((t) => !t.completed && isBefore(t.dueDate, today));

  return backlogTasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function getBacklogMessage(daysOverdue: number, tone: 'gentle' | 'firm' | 'savage'): string {
  const messages = {
    gentle: {
      1: "Hey, this task is a day overdue. No worries, you've got this! 💙",
      3: "This has been pending for 3 days. Maybe give it some attention? 🙂",
      7: "A week has passed. It's okay, just try to wrap this up soon! 🌟",
      14: "Two weeks is quite a while. Let's tackle this together! 💪",
      30: "A month has gone by. I believe in you - you can finish this! ✨",
    },
    firm: {
      1: "Task overdue by 1 day. Time to get moving. ⏰",
      3: "3 days overdue. This needs your attention now.",
      7: "1 week overdue. Stop procrastinating and finish this.",
      14: "2 weeks overdue. This is getting serious. Take action.",
      30: "1 month overdue. This is unacceptable. Complete it today.",
    },
    savage: {
      1: "Bruh, it's been a day. What are you even doing? 😤",
      3: "3 days and counting. Are you allergic to productivity? 🙄",
      7: "A WHOLE WEEK? At this point just delete it fam. 💀",
      14: "2 weeks... I have no words. This is embarrassing. 🤦",
      30: "A MONTH?! Bro where is your assistant, you clearly don't know what to do with your day. 🔥💀",
    },
  };

  const toneMessages = messages[tone];
  if (daysOverdue >= 30) return toneMessages[30];
  if (daysOverdue >= 14) return toneMessages[14];
  if (daysOverdue >= 7) return toneMessages[7];
  if (daysOverdue >= 3) return toneMessages[3];
  return toneMessages[1];
}

export function calculateDaysOverdue(dueDate: Date): number {
  const today = new Date();
  const diff = today.getTime() - dueDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getPanicModeAdvice(daysUntilExam: number, chaptersRemaining: number): string {
  const chaptersPerDay = chaptersRemaining / daysUntilExam;

  if (daysUntilExam <= 1) {
    return `🚨 PANIC MODE ACTIVATED! ${daysUntilExam} day left, ${chaptersRemaining} chapters. Focus on: 1) Important formulas/concepts 2) Past year questions 3) Quick revision notes. Skip details, go for breadth over depth!`;
  } else if (chaptersPerDay > 3) {
    return `⚠️ High pressure! You need to cover ${chaptersPerDay.toFixed(1)} chapters/day. Strategy: 1) Skim read first 2) Focus on examples 3) Make quick notes 4) Practice key problems only.`;
  } else if (chaptersPerDay > 1.5) {
    return `📚 Moderate pace needed. ${chaptersPerDay.toFixed(1)} chapters/day. Plan: 1) Read thoroughly 2) Solve important problems 3) Make revision notes 4) Take short breaks.`;
  } else {
    return `✅ You're in good shape! ${chaptersPerDay.toFixed(1)} chapters/day is manageable. Recommended: 1) Deep understanding 2) Solve all problems 3) Make detailed notes 4) Revise twice.`;
  }
}