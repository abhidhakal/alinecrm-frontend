
interface BreakdownRowProps {
  label: string;
  value: number;
}

export default function BreakdownRow({ label, value }: BreakdownRowProps) {
  return (
    <div className="flex justify-between items-center bg-transparent">
      <span className="text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg flex-1">{label}</span>
      <span className="text-sm font-bold text-slate-900 ml-4">{value}</span>
    </div>
  );
}
