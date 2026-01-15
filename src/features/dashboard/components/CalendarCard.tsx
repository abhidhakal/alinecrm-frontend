import { format, addDays, startOfWeek, getDay } from 'date-fns';

interface CalendarEvent {
  title: string;
  dueDate: string;
  type?: 'meeting' | 'task' | 'report';
}

interface CalendarCardProps {
  events: CalendarEvent[];
  /** Array of day indices (0=Sunday, 6=Saturday) to mark as weekends/holidays. Default is [0, 6] (Sunday & Saturday) */
  weekendDays?: number[];
}

export default function CalendarCard({ events, weekendDays = [0, 6] }: CalendarCardProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Start on Sunday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const getTypeStyles = (type?: string) => {
    switch (type) {
      case 'task': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'report': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getDayStyles = (day: Date) => {
    const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    const dayOfWeek = getDay(day);
    const isWeekend = weekendDays.includes(dayOfWeek);

    if (isToday) {
      // Today: black background, white text
      return 'bg-slate-900 text-white shadow-md font-bold';
    }
    if (isWeekend) {
      // Weekend/holiday: rose/red text
      return 'text-rose-500 hover:bg-rose-50 font-medium';
    }
    // Regular day
    return 'text-slate-900 hover:bg-slate-50';
  };

  return (
    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 text-sm">Calendar - {format(today, 'yyyy')}</h3>
        <span className="text-xs font-bold text-slate-400">{format(today, 'MMMM')}</span>
      </div>

      {/* Date Strip */}
      <div className="flex justify-between mb-6">
        {weekDays.map((day, i) => {
          const dayOfWeek = getDay(day);
          const isWeekend = weekendDays.includes(dayOfWeek);

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-[10px] font-bold uppercase ${isWeekend ? 'text-rose-400' : 'text-slate-400'}`}>
                {format(day, 'eee')}
              </span>
              <div className={`h-8 w-8 flex items-center justify-center rounded-full text-xs transition-all ${getDayStyles(day)}`}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-b border-slate-100 mb-6"></div>

      {/* Agenda Items */}
      <div className="flex-1 overflow-y-auto pr-1">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div key={idx} className="flex gap-4 border-b border-dashed border-slate-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
              <span className="text-[10px] font-bold text-slate-400 w-12 pt-3 shrink-0">
                {format(new Date(event.dueDate), 'h:mm a')}
              </span>
              <div className={`flex-1 p-3 rounded-xl text-[11px] font-bold border truncate transition-all hover:shadow-sm ${getTypeStyles(event.type)}`}>
                {event.title}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-60">
            <p className="text-xs italic">No events scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
