import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { TaskStatusType } from "../../../constants/task.constants";
import { TASK_STATUS } from "../../../constants/task.constants";
import type { Task, CreateTaskDto, TaskAttachment, TaskLink } from "../../../types/task.types";
import { useGetAllUsers } from "../../../api/users.api";
import { useAuth } from "../../../context/AuthContext";
import DatePicker from "../../../components/DatePicker";
import { useCreateTask, useUpdateTask } from "../../../api/tasks.api";
import API from "../../../lib/axios";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for attachments and links
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [links, setLinks] = useState<TaskLink[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
        setAttachments(task.attachments || []);
        setLinks(task.links || []);
      } else {
        reset({
          title: "",
          description: "",
          category: "",
          dueDate: new Date().toISOString(),
          status: initialStatus || TASK_STATUS.TODO,
          assignedToIds: currentUser ? [currentUser.id] : []
        });
        setAttachments([]);
        setLinks([]);
      }
      setNewLinkUrl('');
      setNewLinkTitle('');
    }
  }, [isOpen, task, initialStatus, currentUser, reset]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await API.post<{ url: string; name: string }>('/upload/task-attachment', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setAttachments(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (newLinkUrl.trim()) {
      setLinks([...links, {
        url: newLinkUrl.trim(),
        title: newLinkTitle.trim() || newLinkUrl.trim()
      }]);
      setNewLinkUrl('');
      setNewLinkTitle('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: CreateTaskDto & { id?: number }) => {
    try {
      const taskData = { ...data, attachments, links };
      if (data.id) {
        await updateTaskMutation.mutateAsync({ id: data.id, data: taskData });
      } else {
        await createTaskMutation.mutateAsync(taskData);
      }
      onClose();
    } catch (error) {
      console.error(data.id ? "Failed to update task:" : "Failed to create task:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-[900px] max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">
        {/* Main Form Area */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
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

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wide">Task Title</label>
              <input
                {...register('title', { required: true })}
                placeholder="e.g. Redesign Homepage"
                className="w-full text-lg font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wide">Description</label>
              <textarea
                {...register('description', { required: true })}
                placeholder="Add a detailed description..."
                rows={3}
                className="w-full text-sm font-medium text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all resize-none placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 tracking-wide">Category</label>
                <input
                  {...register('category')}
                  placeholder="Design"
                  className="w-full text-sm font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-gray-300 outline-none transition-all"
                />
              </div>
              <div className="space-y-2 relative z-[10000]">
                <label className="text-xs font-bold text-gray-700 tracking-wide">Due Date</label>
                <DatePicker
                  date={dueDate ? new Date(dueDate) : undefined}
                  setDate={(date) => setValue('dueDate', date ? date.toISOString() : "")}
                  placeholder="Select due date"
                  position="top"
                  align="right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wide">Status</label>
              <div className="relative">
                <select
                  {...register('status')}
                  className="w-full appearance-none text-sm font-semibold text-foreground bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:bg-white focus:border-gray-300 outline-none transition-all pr-10"
                >
                  {Object.values(TASK_STATUS).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 tracking-wide">Attachments</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {isUploading ? (
                    <span className="animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add File
                    </>
                  )}
                </button>
              </div>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment, index) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment.url);
                    return (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 group">
                        {isImage ? (
                          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">{attachment.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Links Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wide">Reference Links</label>
              {links.length > 0 && (
                <div className="space-y-2 mb-2">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 group">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-xs font-medium text-blue-600 truncate flex-1">{link.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="flex-1 text-sm bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:bg-white focus:border-gray-300 outline-none"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="flex-1 text-sm bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 focus:bg-white focus:border-gray-300 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                disabled={isSubmitting || isUploading}
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
              <h3 className="text-xs font-bold text-gray-400 tracking-wider">Assigned To</h3>
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
