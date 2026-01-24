import {
  Course,
  Task,
  Habit,
  Event,
  Contest,
  StudyTrack,
  Goal,
  StreakLog,
  Notification,
} from '@/types';

export function getMockData() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const courses: Course[] = [
    {
      id: '1',
      name: 'Data Structures & Algorithms',
      code: 'CS301',
      instructor: 'Dr. Smith',
      credits: 4,
      color: '#3B82F6',
      totalClasses: 40,
      attendedClasses: 32,
      minAttendance: 75,
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '10:30', location: 'Room 101' },
        { day: 'Wednesday', startTime: '09:00', endTime: '10:30', location: 'Room 101' },
      ],
      dontForget: 'Bring laptop for coding sessions',
    },
    {
      id: '2',
      name: 'Machine Learning',
      code: 'CS402',
      instructor: 'Prof. Johnson',
      credits: 4,
      color: '#10B981',
      totalClasses: 35,
      attendedClasses: 30,
      minAttendance: 75,
      schedule: [
        { day: 'Tuesday', startTime: '14:00', endTime: '15:30', location: 'Lab 203' },
        { day: 'Thursday', startTime: '14:00', endTime: '15:30', location: 'Lab 203' },
      ],
      dontForget: 'Assignment due every Friday',
    },
    {
      id: '3',
      name: 'Database Management Systems',
      code: 'CS303',
      instructor: 'Dr. Williams',
      credits: 3,
      color: '#F59E0B',
      totalClasses: 30,
      attendedClasses: 22,
      minAttendance: 75,
      schedule: [
        { day: 'Monday', startTime: '11:00', endTime: '12:30', location: 'Room 205' },
        { day: 'Friday', startTime: '11:00', endTime: '12:30', location: 'Room 205' },
      ],
    },
    {
      id: '4',
      name: 'Operating Systems',
      code: 'CS304',
      instructor: 'Prof. Brown',
      credits: 4,
      color: '#EF4444',
      totalClasses: 38,
      attendedClasses: 35,
      minAttendance: 75,
      schedule: [
        { day: 'Tuesday', startTime: '09:00', endTime: '10:30', location: 'Room 102' },
        { day: 'Thursday', startTime: '09:00', endTime: '10:30', location: 'Room 102' },
      ],
      dontForget: 'Lab exam next week',
    },
  ];

  const tasks: Task[] = [
    {
      id: '1',
      title: 'DSA Assignment 3: Graph Algorithms',
      description: 'Implement Dijkstra and Floyd-Warshall algorithms',
      type: 'assignment',
      priority: 'high',
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      completed: false,
      courseId: '1',
      estimatedHours: 4,
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'ML Quiz 2: Neural Networks',
      type: 'quiz',
      priority: 'critical',
      dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      completed: false,
      courseId: '2',
      estimatedHours: 2,
      createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'DBMS Mid-Term Exam',
      description: 'Chapters 1-6: SQL, Normalization, Transactions',
      type: 'exam',
      priority: 'critical',
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      completed: false,
      courseId: '3',
      estimatedHours: 8,
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      title: 'Upsolve: Codeforces Round 920 Div 2',
      description: 'Problems C, D, E',
      type: 'upsolve',
      priority: 'medium',
      dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
      contestId: 'cf920',
      estimatedHours: 3,
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      title: 'Laundry Day',
      type: 'chore',
      priority: 'low',
      dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      completed: false,
      estimatedHours: 1,
      createdAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: '6',
      title: 'OS Assignment 2: Process Scheduling',
      description: 'Implement Round Robin and Priority Scheduling',
      type: 'assignment',
      priority: 'high',
      dueDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
      completed: false,
      courseId: '4',
      estimatedHours: 5,
      createdAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      id: '7',
      title: 'Check Internship Emails',
      type: 'todo',
      priority: 'medium',
      dueDate: today,
      completed: false,
      estimatedHours: 0.5,
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  const habits: Habit[] = [
    {
      id: '1',
      name: 'Morning Workout',
      description: 'Gym or home workout',
      icon: '💪',
      color: '#10B981',
      frequency: 'daily',
      currentStreak: 7,
      longestStreak: 21,
      completedDates: generateCompletedDates(today, 7),
    },
    {
      id: '2',
      name: 'Drink 8 Glasses of Water',
      icon: '💧',
      color: '#3B82F6',
      frequency: 'daily',
      currentStreak: 12,
      longestStreak: 30,
      completedDates: generateCompletedDates(today, 12),
    },
    {
      id: '3',
      name: 'Solve 2 CP Problems',
      description: 'Daily competitive programming practice',
      icon: '💻',
      color: '#F59E0B',
      frequency: 'daily',
      currentStreak: 5,
      longestStreak: 15,
      completedDates: generateCompletedDates(today, 5),
    },
    {
      id: '4',
      name: 'Basketball Practice',
      icon: '🏀',
      color: '#EF4444',
      frequency: 'weekly',
      targetDays: [2, 4, 6], // Tuesday, Thursday, Saturday
      currentStreak: 3,
      longestStreak: 8,
      completedDates: generateWeeklyCompletedDates(today, 3, [2, 4, 6]),
    },
    {
      id: '5',
      name: 'Read for 30 Minutes',
      icon: '📚',
      color: '#8B5CF6',
      frequency: 'daily',
      currentStreak: 4,
      longestStreak: 10,
      completedDates: generateCompletedDates(today, 4),
    },
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'Tech Fest 2024',
      description: 'Annual college technical festival',
      type: 'global',
      category: 'fest',
      startTime: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      location: 'Main Campus',
      isAllDay: true,
    },
    {
      id: '2',
      title: 'Guest Lecture: AI in Healthcare',
      description: 'Dr. Sarah Chen from MIT',
      type: 'global',
      category: 'talk',
      startTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      location: 'Auditorium',
      isAllDay: false,
    },
    {
      id: '3',
      title: 'DBMS Viva',
      description: 'Oral examination for DBMS course',
      type: 'personal',
      category: 'viva',
      startTime: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
      location: 'Faculty Room 301',
      isAllDay: false,
    },
    {
      id: '4',
      title: 'EDM Night',
      description: 'College DJ night event',
      type: 'global',
      category: 'fest',
      startTime: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
      location: 'Open Air Theatre',
      isAllDay: false,
    },
    {
      id: '5',
      title: 'ML Project Presentation',
      type: 'personal',
      category: 'presentation',
      startTime: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
      location: 'Lab 203',
      isAllDay: false,
    },
  ];

  const contests: Contest[] = [
    {
      id: 'cf920',
      name: 'Codeforces Round 920 (Div. 2)',
      platform: 'codeforces',
      startTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      duration: 120,
      registered: true,
      participated: false,
    },
    {
      id: 'cc145',
      name: 'CodeChef Starters 145',
      platform: 'codechef',
      startTime: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      duration: 180,
      registered: false,
      participated: false,
    },
    {
      id: 'lc402',
      name: 'LeetCode Weekly Contest 402',
      platform: 'leetcode',
      startTime: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      duration: 90,
      registered: true,
      participated: false,
    },
    {
      id: 'at358',
      name: 'AtCoder Beginner Contest 358',
      platform: 'atcoder',
      startTime: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000),
      duration: 100,
      registered: false,
      participated: false,
    },
  ];

  const studyTracks: StudyTrack[] = [
    {
      id: '1',
      name: "Striver's SDE Sheet",
      description: '180 most important DSA problems',
      type: 'cp',
      totalItems: 180,
      completedItems: 87,
      link: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
    },
    {
      id: '2',
      name: 'Andrew Ng ML Course',
      description: 'Coursera Machine Learning Specialization',
      type: 'ml',
      totalItems: 45,
      completedItems: 23,
      link: 'https://www.coursera.org/specializations/machine-learning-introduction',
    },
    {
      id: '3',
      name: 'Codeforces Ladder (1400-1600)',
      description: 'Practice problems for rating improvement',
      type: 'cp',
      totalItems: 100,
      completedItems: 34,
    },
    {
      id: '4',
      name: 'Full Stack Web Development',
      description: 'MERN stack tutorial series',
      type: 'web',
      totalItems: 60,
      completedItems: 18,
    },
  ];

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Solve 50 CP Problems',
      description: 'Monthly competitive programming goal',
      type: 'monthly',
      targetValue: 50,
      currentValue: 32,
      unit: 'problems',
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      completed: false,
    },
    {
      id: '2',
      title: 'Attend All Classes',
      description: 'Daily attendance goal',
      type: 'daily',
      targetValue: 4,
      currentValue: 3,
      unit: 'classes',
      startDate: today,
      endDate: today,
      completed: false,
    },
    {
      id: '3',
      title: 'Complete ML Course',
      description: 'Finish Andrew Ng course by year end',
      type: 'annual',
      targetValue: 45,
      currentValue: 23,
      unit: 'lectures',
      startDate: new Date(today.getFullYear(), 0, 1),
      endDate: new Date(today.getFullYear(), 11, 31),
      completed: false,
    },
    {
      id: '4',
      title: 'Winter Break Sprint',
      description: 'Complete 30 problems during vacation',
      type: 'vacation',
      targetValue: 30,
      currentValue: 12,
      unit: 'problems',
      startDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
      completed: false,
    },
  ];

  const streakLogs: StreakLog[] = generateStreakLogs(today, 90);

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Contest Reminder',
      message: 'Codeforces Round 920 starts in 2 days. Register now!',
      type: 'info',
      read: false,
      createdAt: new Date(today.getTime() - 1 * 60 * 60 * 1000),
      actionLink: '/career',
    },
    {
      id: '2',
      title: 'Attendance Alert',
      message: 'DBMS attendance is at 73%. You need to attend next 2 classes!',
      type: 'warning',
      read: false,
      createdAt: new Date(today.getTime() - 3 * 60 * 60 * 1000),
      actionLink: '/academic',
    },
    {
      id: '3',
      title: 'Task Overdue',
      message: 'Check Internship Emails is overdue by 1 day',
      type: 'error',
      read: false,
      createdAt: new Date(today.getTime() - 5 * 60 * 60 * 1000),
      actionLink: '/tasks',
    },
    {
      id: '4',
      title: 'Streak Milestone! 🔥',
      message: 'You completed 7 days of Morning Workout!',
      type: 'success',
      read: true,
      createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      actionLink: '/life',
    },
  ];

  return {
    courses,
    tasks,
    habits,
    events,
    contests,
    studyTracks,
    goals,
    streakLogs,
    notifications,
  };
}

function generateCompletedDates(today: Date, streakDays: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < streakDays; i++) {
    dates.push(new Date(today.getTime() - i * 24 * 60 * 60 * 1000));
  }
  return dates;
}

function generateWeeklyCompletedDates(today: Date, weeks: number, targetDays: number[]): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (targetDays.includes(date.getDay())) {
      dates.push(date);
    }
  }
  return dates;
}

function generateStreakLogs(today: Date, days: number): StreakLog[] {
  const logs: StreakLog[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const activityCount = Math.floor(Math.random() * 15) + 5;
    logs.push({
      date,
      activityCount,
      tasksCompleted: Math.floor(Math.random() * 5) + 1,
      classesAttended: Math.floor(Math.random() * 4) + 1,
      habitsCompleted: Math.floor(Math.random() * 4) + 2,
      problemsSolved: Math.floor(Math.random() * 3) + 1,
    });
  }
  return logs;
}