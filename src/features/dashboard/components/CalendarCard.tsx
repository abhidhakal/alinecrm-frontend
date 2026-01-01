import { format, addDays, startOfWeek } from 'date-fns';

interface CalendarEvent {
  title: string;
  dueDate: string;
  type?: 'meeting' | 'task' | 'report';
}

interface CalendarCardProps {
  events: CalendarEvent[];
}

export default function CalendarCard({ events }: CalendarCardProps) {
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

  return (
    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 text-sm">Calendar - {format(today, 'yyyy')}</h3>
        <span className="text-xs font-bold text-slate-400">{format(today, 'MMMM')}</span>
      </div>

      {/* Date Strip */}
      <div className="flex justify-between mb-8">
        {weekDays.map((day, i) => {
          const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{format(day, 'eee')}</span>
              <div className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${isToday ? 'bg-rose-500 text-white shadow-md' : 'text-slate-900 hover:bg-slate-50'
                }`}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agenda Items */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div key={idx} className="flex gap-4">
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
