import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Conflict {
  type: string;
  items: string[];
  date: Date;
}

interface ConflictDetectorProps {
  conflicts: Conflict[];
}

export function ConflictDetector({ conflicts }: ConflictDetectorProps) {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-900 border-amber-500/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-amber-500">Smart Conflict Detector</CardTitle>
        </div>
        <CardDescription>
          {conflicts.length} potential scheduling {conflicts.length === 1 ? 'conflict' : 'conflicts'} detected
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conflicts.map((conflict, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-400 mb-2">
                    {format(conflict.date, 'EEEE, MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-slate-300 mb-2">
                    Multiple items scheduled on the same day:
                  </p>
                  <ul className="space-y-1">
                    {conflict.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-amber-500 mt-3">
                    ⚠️ Consider rescheduling or prioritizing tasks
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}