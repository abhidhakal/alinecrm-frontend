import { useState, useEffect } from "react";
import { TaskStatus, type TaskStatusType, tasksApi, type Task } from "../api/tasks";
import { usersApi, type User } from "../api/users";
import { useAuth } from "../context/AuthContext";
import DatePicker from "./DatePicker";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus?: TaskStatusType;
  task?: Task | null;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess, initialStatus, task }: AddTaskModalProps) {
  const { user: currentUser, isAdmin } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status] = useState<TaskStatusType>(initialStatus || TaskStatus.TODO);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [assignedToIds, setAssignedToIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && isAdmin) {
      usersApi.getAll().then(setUsers).catch(console.error);
    }
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (isOpen && task) {
      // Editing mode - populate with existing data
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssignedToIds(task.assignedTo?.map(u => u.id) || []);
    } else if (isOpen && !task) {
      // Create mode - reset to defaults
      setTitle('');
      setDescription('');
      setCategory('');
      setDueDate('');
      setAssignedToIds(currentUser ? [currentUser.id] : []);
    }
  }, [isOpen, task, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) {
        // Update existing task
        await tasksApi.update(task.id, {
          title,
          description,
          category,
          dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
          status,
          assignedToIds: assignedToIds,
        });
      } else {
        // Create new task
        await tasksApi.create({
          title,
          description,
          category,
          dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
          status,
          progress: 0,
          assignedToIds: assignedToIds,
        });
      }
      onSuccess();
      onClose();
      setTitle("");
      setDescription("");
      setCategory("");
      setDueDate("");
      setAssignedToIds([]);
    } catch (error) {
      console.error(task ? "Failed to update task:" : "Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-[850px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">

        {/* Main Form Area */}
        <div className="flex-1 p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{task ? 'Edit Task' : 'Create New Task'}</h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Add details for your new task card</p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src="/icons/close-icon-small.svg" alt="close" className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Task Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Redesign Homepage"
                className="w-full text-lg font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description..."
                rows={4}
                className="w-full text-sm font-medium text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all resize-none placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Design"
                  className="w-full text-sm font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Due Date</label>
                <DatePicker
                  date={dueDate ? new Date(dueDate) : undefined}
                  setDate={(date) => setDueDate(date ? date.toISOString() : "")}
                  placeholder="Select due date"
                  position="top"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-3.5 bg-foreground text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">{task ? 'Updating...' : 'Creating...'}</span>
                ) : (
                  <>
                    <img src="/icons/plus-icon.svg" alt="" className="h-4 w-4 invert brightness-0" />
                    {task ? 'Update Task' : 'Create Task'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar / Right Column */}
        <div className="hidden md:flex w-[280px] bg-gray-50/50 border-l border-gray-100 p-8 flex-col">
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"
            >
              <img src="/icons/close-icon-small.svg" alt="close" className="h-6 w-6 opacity-40 hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned To</h3>
              <div className="space-y-3">
                {isAdmin ? (
                  <div className="space-y-2">
                    {users.map(u => (
                      <label key={u.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={assignedToIds.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedToIds([...assignedToIds, u.id]);
                            } else {
                              setAssignedToIds(assignedToIds.filter(id => id !== u.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-2 focus:ring-gray-200"
                        />
                        {u.profilePicture ? (
                          <img src={u.profilePicture} className="h-8 w-8 rounded-full object-cover" alt={u.name} />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">
                              {u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                            </span>
                          </div>
                        )}
                        <span className="text-xs font-bold text-gray-700">{u.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                    {currentUser?.profilePicture ? (
                      <img src={currentUser.profilePicture} className="h-8 w-8 rounded-full object-cover" alt={currentUser.name} />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-bold text-gray-700">{currentUser?.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned By</h3>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                {currentUser?.profilePicture ? (
                  <img src={currentUser.profilePicture} className="h-8 w-8 rounded-full object-cover" alt={currentUser.name} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">
                      {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </span>
                  </div>
                )}
                <span className="text-xs font-bold text-gray-700">{currentUser?.name}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

