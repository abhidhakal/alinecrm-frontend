
interface WinRateInfoProps {
  label: string;
  value: number;
  type: 'won' | 'lost';
}

export default function WinRateInfo({ label, value, type }: WinRateInfoProps) {
  const colorClass = type === 'won' ? 'border-emerald-500/30 text-emerald-600' : 'border-rose-500/30 text-rose-600';
  return (
    <div className={`bg-white rounded-xl p-3 border flex items-center justify-between ${colorClass}`}>
      <span className="text-[11px] font-bold">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}
