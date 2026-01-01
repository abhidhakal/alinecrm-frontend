import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  userName: string;
  role?: string;
}

export default function HeroSection({ userName, role }: HeroSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-transparent p-2 rounded-[24px] shadow-sm flex items-center gap-6 h-full min-h-[160px]">
      {/* Date Card - Figma Style */}
      <div className="flex flex-col items-stretch overflow-hidden rounded-[16px] bg-[#BFD7EA] min-w-[140px] shadow-sm">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-7xl font-black text-black leading-none">
            {format(currentTime, 'd')}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground uppercase tracking-tighter">
              {format(currentTime, 'MMM')}
            </span>
            <span className="text-sm font-bold text-foreground uppercase tracking-tighter">
              {format(currentTime, 'yyyy')}
            </span>
          </div>
        </div>
        <div className="px-4 py-2 text-center">
          <span className="text-md font-extrabold text-[#0B3954] tracking-wider">
            {format(currentTime, 'EEEE')}
          </span>
        </div>
      </div>

      {/* Greeting & Clock */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {role ? `${role}, ` : ''}{userName.split(' ')[0]}
          </h2>
          <p className="text-[11px] font-bold text-slate-500 mb-3">How has your day been?</p>

          <div className="inline-flex self-start items-center bg-[#1A1A1A] text-white px-5 py-2 rounded-full shadow-lg">
            <span className="text-[16px] font-bold tracking-[0.2em] font-mono">
              {format(currentTime, 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
