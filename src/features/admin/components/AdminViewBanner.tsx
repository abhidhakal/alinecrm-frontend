
interface AdminViewBannerProps {
  label: string;
  stats?: string;
}

export default function AdminViewBanner({ label, stats }: AdminViewBannerProps) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <img src="/icons/shield-icon.svg" alt="Shield" className="h-6 w-6 filter brightness-0 invert" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Administrator Control</h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{label}</p>
          </div>
        </div>
        {stats && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 uppercase tracking-widest shadow-sm">
              {stats}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
