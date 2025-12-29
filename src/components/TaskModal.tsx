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
      <div className="bg-white rounded-[16px] w-full max-w-[900px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Task Details</p>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src="/icons/close-icon-large.svg" alt="close" className="h-7 w-7" />
          </button>
        </div>

        {/* Main Content Bordered Area */}
        <div className="mx-10 mb-10 border border-gray-200 rounded-[24px] p-6 flex flex-col md:flex-row gap-8">
          
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Task Description</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="bg-[#EAF3FF] rounded-[16px] p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Category</p>
                <p className="text-2xl font-bold text-gray-900">{task.category || "General"}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-800 font-bold">
                  <img src="/icons/alarm-icon-filled.svg" alt="assigned" className="h-5 w-5 opacity-80" />
                  <span className="text-sm">Assigned Date: {new Date(task.assignedDate || task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 font-bold">
                  <img src="/icons/calendar-icon-filled.svg" alt="due" className="h-5 w-5 opacity-80" />
                  <span className="text-sm">Due Date: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">Progress</span>
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3B82F6] transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-900">{task.progress}%</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-[300px] space-y-6 md:border-l md:border-gray-100 md:pl-8">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Assigned To</h3>
              <div className="space-y-2">
                {task.assignedTo?.length > 0 ? task.assignedTo.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="h-9 w-9 rounded-full border-2 border-white shadow-sm object-cover" />
                    ) : (
                      <div className="h-9 w-9 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500 italic">Not assigned</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">Assigned By</h3>
              {task.assignedBy ? (
                <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl">
                  {task.assignedBy.profilePicture ? (
                    <img src={task.assignedBy.profilePicture} alt={task.assignedBy.name} className="h-9 w-9 rounded-full border-2 border-white shadow-sm object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {task.assignedBy.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-gray-800">{task.assignedBy.name}</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">Unknown</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
