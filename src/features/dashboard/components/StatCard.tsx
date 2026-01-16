
interface StatCardProps {
  title: string;
  value: string | number;
  growth?: string;
  growthDesc?: string;
  isSmallText?: boolean;
}

export default function StatCard({ title, value, growth, growthDesc, isSmallText }: StatCardProps) {
  return (
    <div className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
      <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className={`${isSmallText ? 'text-2xl' : 'text-4xl'} font-bold text-slate-900 tracking-tight`}>{value}</span>
        {growth && (
          <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded-full">
            {growth} <span className="text-emerald-500/60 font-medium">{growthDesc}</span>
          </span>
        )}
      </div>
    </div>
  );
}
