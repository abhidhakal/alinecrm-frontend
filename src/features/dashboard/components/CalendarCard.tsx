import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, getDay, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(today);

  // Calculate week start based on offset
  const weekStart = useMemo(() => {
    const baseWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    return addDays(baseWeekStart, weekOffset * 7);
  }, [weekOffset]);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Filter events for selected day
  const selectedDayEvents = useMemo(() => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return events.filter(event => {
      const eventDateStr = event.dueDate?.split('T')[0] || event.dueDate;
      return eventDateStr === selectedDateStr;
    });
  }, [events, selectedDate]);

  // Get event count per day for dot indicators
  const eventCountByDay = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(event => {
      const dateStr = event.dueDate?.split('T')[0] || event.dueDate;
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    return counts;
  }, [events]);

  const getTypeStyles = (type?: string) => {
    switch (type) {
      case 'task': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'report': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getDayStyles = (day: Date) => {
    const isToday = isSameDay(day, today);
    const isSelected = isSameDay(day, selectedDate);
    const dayOfWeek = getDay(day);
    const isWeekend = weekendDays.includes(dayOfWeek);

    if (isSelected) {
      return 'bg-slate-900 text-white shadow-md font-bold';
    }
    if (isToday) {
      return 'bg-slate-200 text-slate-900 font-bold';
    }
    if (isWeekend) {
      return 'text-rose-500 hover:bg-rose-50 font-medium';
    }
    return 'text-slate-900 hover:bg-slate-100';
  };

  const goToPreviousWeek = () => setWeekOffset(prev => prev - 1);
  const goToNextWeek = () => setWeekOffset(prev => prev + 1);
  const goToToday = () => {
    setWeekOffset(0);
    setSelectedDate(today);
  };

  return (
    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-sm">Calendar</h3>
          <span className="text-xs font-bold text-slate-400">{format(weekStart, 'MMM yyyy')}</span>
        </div>
        <div className="flex items-center gap-1">
          {weekOffset !== 0 && (
            <button
              onClick={goToToday}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors mr-1"
            >
              Today
            </button>
          )}
          <button
            onClick={goToPreviousWeek}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Date Strip with Click-to-Select */}
      <div className="flex justify-between mb-6">
        {weekDays.map((day, i) => {
          const dayOfWeek = getDay(day);
          const isWeekend = weekendDays.includes(dayOfWeek);
          const dateStr = format(day, 'yyyy-MM-dd');
          const eventCount = eventCountByDay[dateStr] || 0;

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <span className={`text-[10px] font-bold uppercase ${isWeekend ? 'text-rose-400' : 'text-slate-400'}`}>
                {format(day, 'eee')}
              </span>
              <div className={`h-8 w-8 flex items-center justify-center rounded-full text-xs transition-all ${getDayStyles(day)}`}>
                {format(day, 'd')}
              </div>
              {/* Event Dot Indicator */}
              <div className="h-1.5 flex gap-0.5">
                {eventCount > 0 && (
                  <div className={`w-1.5 h-1.5 rounded-full ${eventCount >= 3 ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                )}
                {eventCount > 1 && (
                  <div className={`w-1.5 h-1.5 rounded-full ${eventCount >= 3 ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-b border-slate-100 mb-4"></div>

      {/* Selected Day Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-700">
          {isSameDay(selectedDate, today) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Agenda Items for Selected Day */}
      <div className="flex-1 overflow-y-auto pr-1">
        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event, idx) => (
            <div key={idx} className="flex gap-4 border-b border-dashed border-slate-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
              <span className="text-[10px] font-bold text-slate-400 w-12 pt-2.5 shrink-0">
                {event.dueDate?.includes('T') ? format(new Date(event.dueDate), 'h:mm a') : 'All day'}
              </span>
              <div className={`flex-1 p-2.5 rounded-xl text-[11px] font-bold border truncate transition-all hover:shadow-sm ${getTypeStyles(event.type)}`}>
                {event.title}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-60">
            <p className="text-xs italic">No events for this day</p>
          </div>
        )}
      </div>
    </div>
  );
}
