import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { TaskStatusType } from "../../../constants/task.constants";
import { TASK_STATUS } from "../../../constants/task.constants";
import type { Task, CreateTaskDto } from "../../../types/task.types";
import { useGetAllUsers } from "../../../api/users.api";
import { useAuth } from "../../../context/AuthContext";
import DatePicker from "../../../components/DatePicker";
import { useCreateTask, useUpdateTask } from "../../../api/tasks.api";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: TaskStatusType;
  task?: Task | null;
}

export default function AddTaskModal({ isOpen, onClose, initialStatus, task }: AddTaskModalProps) {
  const { user: currentUser } = useAuth();
  const { data: users = [] } = useGetAllUsers();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<CreateTaskDto & { id?: number }>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      dueDate: new Date().toISOString(),
      status: initialStatus || TASK_STATUS.TODO,
      assignedToIds: currentUser ? [currentUser.id] : []
    }
  });

  const assignedToIds = watch('assignedToIds') || [];
  const dueDate = watch('dueDate');

  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category || "",
          dueDate: task.dueDate,
          status: task.status,
          assignedToIds: task.assignedTo?.map(u => u.id) || []
        });
      } else {
        reset({
          title: "",
          description: "",
          category: "",
          dueDate: new Date().toISOString(),
          status: initialStatus || TASK_STATUS.TODO,
          assignedToIds: currentUser ? [currentUser.id] : []
        });
      }
    }
  }, [isOpen, task, initialStatus, currentUser, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateTaskDto & { id?: number }) => {
    try {
      if (data.id) {
        await updateTaskMutation.mutateAsync({ id: data.id, data });
      } else {
        await createTaskMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error(data.id ? "Failed to update task:" : "Failed to create task:", error);
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
              <p className="text-sm font-medium text-gray-500 mt-1">Add details for your task card</p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src="/icons/close-icon-small.svg" alt="close" className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Task Title</label>
              <input
                {...register('title', { required: true })}
                placeholder="e.g. Redesign Homepage"
                className="w-full text-lg font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
              <textarea
                {...register('description', { required: true })}
                placeholder="Add a detailed description..."
                rows={4}
                className="w-full text-sm font-medium text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all resize-none placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category</label>
                <input
                  {...register('category')}
                  placeholder="Design"
                  className="w-full text-sm font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Due Date</label>
                <DatePicker
                  date={dueDate ? new Date(dueDate) : undefined}
                  setDate={(date) => setValue('dueDate', date ? date.toISOString() : "")}
                  placeholder="Select due date"
                  position="top"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</label>
              <select
                {...register('status')}
                className="w-full text-sm font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:bg-white focus:border-gray-300 outline-none transition-all"
              >
                {Object.values(TASK_STATUS).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3.5 bg-foreground text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
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

        {/* Sidebar */}
        <div className="hidden md:flex w-[280px] bg-gray-50/50 border-l border-gray-100 p-8 flex-col">
          <div className="flex justify-end mb-6">
            <button onClick={onClose} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors">
              <img src="/icons/close-icon-small.svg" alt="close" className="h-6 w-6 opacity-40 hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned To</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {users.map(u => (
                  <label key={u.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={assignedToIds.includes(u.id)}
                      onChange={(e) => {
                        const newIds = e.target.checked
                          ? [...assignedToIds, u.id]
                          : assignedToIds.filter(id => id !== u.id);
                        setValue('assignedToIds', newIds);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-2 focus:ring-gray-200"
                    />
                    {u.profilePicture ? (
                      <img src={u.profilePicture} className="h-8 w-8 rounded-full object-cover" alt={u.name} />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-600">
                          {u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-bold text-gray-700">{u.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
