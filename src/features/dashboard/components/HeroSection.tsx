import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  userName: string;
  role?: string;
  pinnedThought?: string | null;
}

export default function HeroSection({ userName, role, pinnedThought }: HeroSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`transition-all duration-500 p-4 rounded-[24px] shadow-sm flex items-center gap-6 h-full min-h-[160px] relative overflow-hidden ${pinnedThought ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-purple-100' : 'bg-transparent'
      }`}>
      {/* Date Card - Figma Style */}
      <div className="flex flex-col items-stretch overflow-hidden rounded-[16px] bg-[#BFD7EA] min-w-[140px] shadow-sm z-10">
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
        <div className="px-4 pb-4 text-center">
          <span className="text-md font-extrabold text-[#0B3954] tracking-wider">
            {format(currentTime, 'EEEE')}
          </span>
        </div>
      </div>

      {/* Greeting & Clock / Pinned Thought */}
      <div className="flex-1 flex flex-col justify-center z-10">
        {pinnedThought ? (
          <div className="animate-in slide-in-from-bottom-4 duration-700 fade-in">
            <div className="flex items-center gap-2 mb-1">
              <img src="/icons/target-icon.svg" className="h-4 w-4 opacity-50" />
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Daily Focus</span>
            </div>
            <h2 className="text-xl font-medium text-slate-800 leading-relaxed font-cursive" style={{ fontFamily: 'cursive' }}>
              "{pinnedThought}"
            </h2>
          </div>
        ) : (
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
        )}
      </div>

      {pinnedThought && (
        <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 pointer-events-none">
          <span className="text-[150px]">🌸</span>
        </div>
      )}
    </div>
  );
}
