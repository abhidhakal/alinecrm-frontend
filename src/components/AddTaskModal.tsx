import { useState } from "react";
import { TaskStatus, type TaskStatusType, tasksApi } from "../api/tasks";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus?: TaskStatusType;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess, initialStatus }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status] = useState<TaskStatusType>(initialStatus || TaskStatus.TODO);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tasksApi.create({
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        status,
        progress: 0,
      });
      onSuccess();
      onClose();
      setTitle("");
      setDescription("");
      setCategory("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] w-full max-w-[900px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-12 py-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Task Details</p>
            <h2 className="text-3xl font-extra-bold text-gray-900 tracking-tight">Create New Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src="/icons/close-icon-large.svg" alt="close" className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-12 pb-12 flex gap-10">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="space-y-1.5 px-1">
                <label className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Task Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Prediction Model for XYZ Company"
                  className="w-full text-xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-100 focus:border-blue-400 outline-none pb-2 transition-all placeholder:text-gray-200"
                />
              </div>

              <div className="space-y-2 px-1 pt-4">
                <label className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">Task Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Develop and deploy a predictive model..."
                  rows={4}
                  className="w-full text-[15px] font-medium text-gray-500 leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="bg-[#EAF3FF] rounded-[32px] p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-800 uppercase tracking-wider">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="AI Models"
                  className="w-full text-2xl font-bold text-gray-900 bg-transparent outline-none placeholder:text-blue-200"
                />
              </div>

              <div className="flex gap-8">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 text-gray-800 font-bold">
                    <img src="/icons/calendar-icon-filled.svg" alt="due" className="h-5 w-5 opacity-70" />
                    <label className="text-[13px]">Due Date</label>
                  </div>
                  <input
                    required
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/50 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 outline-none border border-transparent focus:border-blue-200 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-bold text-lg shadow-xl hover:bg-black transition-all active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {loading ? "Saving Changes..." : "Save and Create Task"}
            </button>
          </div>

          {/* Right Column (Mocking the design) */}
          <div className="w-[300px] border border-gray-100 rounded-[35px] p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-[16px] font-bold text-gray-800">Assigned To</h3>
              <div className="space-y-4">
                {[
                  { name: "John Doe", id: 1 },
                  { name: "Anne Lee", id: 2 },
                  { name: "Oleg Fitzergald", id: 3 },
                ].map((u) => (
                  <div key={u.id} className="flex items-center gap-4 bg-gray-50/80 p-3 rounded-2xl border border-white">
                    <img src={`https://i.pravatar.cc/150?u=${u.id}`} className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white" />
                    <span className="text-[14px] font-bold text-gray-800">{u.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[16px] font-bold text-gray-800">Assigned By</h3>
              <div className="flex items-center gap-4 bg-gray-50/80 p-3 rounded-2xl border border-white">
                <img src="https://i.pravatar.cc/150?u=99" className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white" />
                <span className="text-[14px] font-bold text-gray-800">Jake Bailey</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

