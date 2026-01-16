import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  position?: 'top' | 'bottom';
  align?: 'left' | 'right';
}

export default function DatePicker({
  date,
  setDate,
  placeholder = "Pick a date",
  className = "",
  position = 'bottom',
  align = 'left'
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const popoverClasses = position === 'top'
    ? "bottom-full mb-2 slide-in-from-bottom-2"
    : "top-full mt-2 slide-in-from-top-2";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-foreground hover:border-gray-300 hover:bg-white transition-all outline-none focus:ring-4 focus:ring-gray-100"
      >
        <CalendarIcon className="h-4 w-4 text-gray-400" />
        <span className={date ? "text-foreground" : "text-gray-400"}>
          {date ? format(date, "PPP") : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute z-[60] bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 animate-in fade-in duration-200 ${popoverClasses} ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <style>{`
            .rdp {
              --rdp-cell-size: 28px;
              --rdp-accent-color: #000000;
              --rdp-background-color: #f3f4f6;
              margin: 0;
            }
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
              background-color: var(--rdp-accent-color) !important;
              color: white !important;
              border-radius: 6px;
              font-weight: bold;
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: #f9fafb;
              border-radius: 6px;
            }
            .rdp-day {
              font-size: 0.75rem;
              font-weight: 500;
            }
            .rdp-head_cell {
              font-size: 0.65rem;
              font-weight: 700;
              text-transform: uppercase;
              color: #9ca3af;
              padding-bottom: 0.3rem;
            }
            .rdp-caption_label {
              font-size: 0.8rem;
              font-weight: 700;
              color: #111827;
            }
            .rdp-nav_button {
              color: #6b7280;
              border-radius: 4px;
              width: 24px;
              height: 24px;
            }
            .rdp-nav_button:hover {
              background-color: #f3f4f6;
              color: #111827;
            }
            .rdp-table {
              max-width: 100%;
            }
            .rdp-months {
              justify-content: center;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setIsOpen(false);
            }}
            components={{
              Chevron: (props) => props.orientation === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
            }}
          />
        </div>
      )}
    </div>
  );
}
