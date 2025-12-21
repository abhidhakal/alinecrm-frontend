import { type Task } from "../api/tasks";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] w-full max-w-[850px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50">
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Task Details</p>
            <h2 className="text-3xl font-extra-bold text-gray-900 tracking-tight">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src="/icons/close-icon-large.svg" alt="close" className="h-6 w-6" />
          </button>
        </div>

        <div className="p-10 flex gap-8">
          {/* Left Column: Description & Details */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Task Description</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {task.description || "Develop and deploy a predictive model for XYZ Company to analyze historical data, forecast key outcomes, and support data-driven decision making. The task includes data preparation, model training, evaluation, and performance monitoring."}
              </p>
            </div>

            <div className="bg-[#EAF3FF] rounded-[24px] p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-[12px] font-bold text-gray-800 uppercase tracking-wider">Category</p>
                <p className="text-2xl font-bold text-gray-900">{task.category || "General"}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-800 font-bold">
                  <img src="/icons/alarm-icon-filled.svg" alt="assigned" className="h-5 w-5" />
                  <span>Assigned Date: {new Date(task.assignedDate || task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 font-bold">
                  <img src="/icons/calendar-icon-filled.svg" alt="due" className="h-5 w-5" />
                  <span>Due Date: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">Progress</span>
                  <span className="text-xl font-bold text-gray-900">{task.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3B82F6] transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Assignees */}
          <div className="w-[280px] border border-gray-100 rounded-[28px] p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-gray-800">Assigned To</h3>
              <div className="space-y-3">
                {task.assignedTo?.length > 0 ? task.assignedTo.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl">
                    <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="h-10 w-10 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                  </div>
                )) : (
                  <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl">
                    <img src={`https://i.pravatar.cc/150?u=1`} alt="John Doe" className="h-10 w-10 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-bold text-gray-800">John Doe</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-gray-800">Assigned By</h3>
              <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl">
                <img src={`https://i.pravatar.cc/150?u=${task.assignedBy?.id || 99}`} alt="Assigner" className="h-10 w-10 rounded-full border-2 border-white shadow-sm" />
                <span className="text-sm font-bold text-gray-800">{task.assignedBy?.name || "Jake Bailey"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
