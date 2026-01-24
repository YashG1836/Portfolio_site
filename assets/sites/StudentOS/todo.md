# StudentOS - Development Plan

## Design Guidelines

### Design References (Primary Inspiration)
- **Notion.so**: Clean, modular dashboard with sidebar navigation
- **Linear.app**: Premium feel, smooth animations, dark mode excellence
- **GitHub**: Contribution grid, activity tracking
- **Style**: Modern Productivity + Dark Mode + Gamification Elements

### Color Palette
- Primary: #0F172A (Slate 900 - background)
- Secondary: #1E293B (Slate 800 - cards/panels)
- Accent: #3B82F6 (Blue 500 - primary actions)
- Success: #10B981 (Emerald 500 - streaks, positive metrics)
- Warning: #F59E0B (Amber 500 - attendance warnings)
- Danger: #EF4444 (Red 500 - critical alerts)
- Text: #F8FAFC (Slate 50), #94A3B8 (Slate 400 - secondary)

### Typography
- Heading1: Inter font-weight 700 (36px) - Dashboard titles
- Heading2: Inter font-weight 600 (28px) - Module headers
- Heading3: Inter font-weight 600 (20px) - Section titles
- Body/Normal: Inter font-weight 400 (14px) - General text
- Body/Emphasis: Inter font-weight 600 (14px) - Important info
- Caption: Inter font-weight 400 (12px) - Metadata, timestamps

### Key Component Styles
- **Cards**: Dark slate background (#1E293B), 1px border (#334155), 12px rounded, hover: lift 4px with glow
- **Buttons**: Primary (#3B82F6), white text, 8px rounded, hover: brighten 10%
- **Badges**: Small pills with colored backgrounds (success/warning/danger variants)
- **Progress Bars**: Gradient fills, smooth animations
- **Consistency Grid**: GitHub-style contribution graph with color intensity levels

### Layout & Spacing
- Sidebar: 280px fixed width, collapsible on mobile
- Main content: Max-width 1400px, 24px padding
- Card spacing: 16px gaps in grid layouts
- Section padding: 32px vertical between major sections

### Images to Generate
1. **hero-dashboard-morning.jpg** - Sunrise/morning theme for dashboard header, warm gradient (Style: photorealistic, inspiring)
2. **academic-books-desk.jpg** - Study desk with books and laptop, organized workspace (Style: photorealistic, clean)
3. **career-coding-screen.jpg** - Developer workspace with code on screen, competitive programming vibe (Style: photorealistic, tech-focused)
4. **life-wellness-yoga.jpg** - Wellness/health theme, person doing yoga or exercise (Style: photorealistic, energetic)
5. **consistency-grid-bg.jpg** - Abstract pattern background for analytics section (Style: geometric, subtle)
6. **logo-student-os.png** - Modern logo with "S" or brain icon, tech aesthetic (Style: vector-style, transparent background)

---

## Development Tasks

### Phase 1: Foundation & Core Layout
1. **Project Setup** - Update package.json, install additional dependencies (recharts for graphs, date-fns for dates)
2. **Generate Images** - Create all 6 images using ImageCreator.generate_image
3. **Layout Structure** - Create AppLayout with Sidebar navigation, TopBar with user menu, and main content area
4. **Routing Setup** - Configure React Router for dashboard, modules, settings pages
5. **Theme System** - Implement dark mode (default) with theme toggle capability

### Phase 2: Dashboard Hub (Morning Briefing)
6. **Dashboard Page** - Main landing page with hero section
7. **Brain Bandwidth Meter** - Visual gauge showing today's workload (weighted by priority)
8. **Quick Tiles** - Module shortcuts (Academic, Career, Life) with key metrics
9. **Consistency Grid** - GitHub-style contribution grid showing daily activity
10. **Upcoming Section** - Next 7 days: deadlines, contests, events, habits

### Phase 3: Academic Survivor Module
11. **Course List** - Display all courses with attendance %, upcoming assignments
12. **Attendance Tracker** - Per-course attendance with "Can I bunk?" calculator
13. **Assignment Manager** - List assignments with due dates, priority, completion status
14. **Exam Tracker** - Upcoming exams with countdown, "Panic Mode" helper
15. **Course Resources** - Links, PDFs, notes per course

### Phase 4: Career Forge Module
16. **Codeforces Dashboard** - Mock rating graph, upcoming contests display
17. **Contest Calendar** - List upcoming CP contests with registration reminders
18. **Upsolve Queue** - Problems to solve after contests (mock data)
19. **Study Tracks** - Progress bars for Striver sheet, ML playlists, etc.
20. **Rating History** - Line chart showing rating progression over time

### Phase 5: Life Support Module
21. **Habit Tracker** - Daily habits (gym, water, basketball) with streak counters
22. **Routine Manager** - Recurring reminders (laundry, email check, etc.)
23. **Event Calendar** - Global events (fests, talks) + personal events (viva, presentations)
24. **Health Dashboard** - Sleep, exercise, water intake tracking
25. **Quick Actions** - Fast-add buttons for common tasks

### Phase 6: Task Management System
26. **Unified Task View** - All tasks (assignments, upsolves, chores, to-dos) in one place
27. **Priority Weighting** - Visual indicators for task importance
28. **Backlog Burner** - Highlight aging tasks with warning messages
29. **Conflict Detector** - Show overlapping events/deadlines
30. **Filters & Sorting** - By module, priority, due date, completion status

### Phase 7: Analytics & Gamification
31. **Weekly Review** - Summary of completed tasks, classes attended, problems solved
32. **Monthly Review** - Aggregated metrics, goal progress, achievements
33. **Streak Visualization** - Detailed view of consistency grid with statistics
34. **Productivity Metrics** - Charts showing activity patterns, peak hours
35. **Goal Progress** - Visual progress bars for daily/weekly/monthly/annual goals

### Phase 8: Settings & Customization
36. **User Profile** - Edit name, email, avatar, bio
37. **Notification Preferences** - Toggle channels (in-app, email), intensity levels
38. **Module Visibility** - Enable/disable specific modules
39. **Backlog Burner Tone** - Choose message style (gentle/firm/savage)
40. **Theme Settings** - Dark/light mode, accent color customization

### Phase 9: Authentication UI
41. **Login Page** - Email/password form with Google OAuth button (UI only)
42. **Signup Page** - Registration form with validation
43. **Protected Routes** - Redirect logic for authenticated/unauthenticated users
44. **User Menu** - Dropdown with profile, settings, logout options

### Phase 10: Polish & Integration
45. **Animations** - Add smooth transitions, hover effects, loading states
46. **Responsive Design** - Mobile-first approach, tablet/desktop optimizations
47. **Mock Data** - Create realistic sample data for all features
48. **Error States** - Empty states, error messages, loading skeletons
49. **Final Testing** - Cross-browser testing, accessibility checks
50. **Documentation** - Update README with feature descriptions, usage guide

---

## Technical Notes

### Data Management
- Use React Context for global state (user, theme, notifications)
- localStorage for persisting user data (courses, tasks, habits, settings)
- Mock API functions for simulating Codeforces integration

### Key Libraries
- recharts: For rating graphs, productivity charts
- date-fns: Date manipulation and formatting
- react-router-dom: Navigation and routing
- lucide-react: Icon library (already included with shadcn/ui)

### Component Structure
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/ (AppLayout, Sidebar, TopBar)
│   ├── dashboard/ (BrainBandwidthMeter, ConsistencyGrid, QuickTiles)
│   ├── academic/ (AttendanceTracker, AssignmentList, ExamTracker)
│   ├── career/ (ContestCalendar, RatingGraph, UpsolveQueue)
│   ├── life/ (HabitTracker, EventCalendar, RoutineManager)
│   ├── tasks/ (TaskList, TaskCard, ConflictDetector)
│   └── analytics/ (WeeklyReview, StreakView, MetricsChart)
├── pages/
│   ├── Dashboard.tsx
│   ├── Academic.tsx
│   ├── Career.tsx
│   ├── Life.tsx
│   ├── Tasks.tsx
│   ├── Analytics.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── DataContext.tsx
├── lib/
│   ├── mockData.ts
│   ├── calculations.ts (attendance, bandwidth, conflicts)
│   └── storage.ts (localStorage utilities)
└── types/
    └── index.ts (TypeScript interfaces)
```

### Priority Features for MVP
1. Dashboard with Brain Bandwidth Meter and Consistency Grid
2. Attendance Tracker with "Can I bunk?" calculator
3. Task Management with Backlog Burner
4. Basic Habit Tracker with streaks
5. Settings for customization

### Future Enhancements (Post-MVP)
- Real Codeforces API integration
- Email notifications (Resend/SendGrid)
- YouTube playlist tracking
- Export data functionality
- Mobile app (React Native)