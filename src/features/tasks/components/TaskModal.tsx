import { useState, useEffect, useRef } from "react";
import type { Task, TaskAttachment, TaskLink } from "../../../types/task.types";
import { TASK_STATUS, type TaskStatusType } from "../../../constants/task.constants";
import { useUpdateTask } from "../../../api/tasks.api";
import API from "../../../lib/axios";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const updateTaskMutation = useUpdateTask();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [links, setLinks] = useState<TaskLink[]>([]);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');

  // Reset state when task changes
  useEffect(() => {
    if (task) {
      setProgress(task.progress || 0);
      setLinks(task.links || []);
      setAttachments(task.attachments || []);
      setIsEditing(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const getStatusConfig = (status: TaskStatusType) => {
    switch (status) {
      case TASK_STATUS.TODO:
        return { label: "To Do", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" };
      case TASK_STATUS.IN_PROGRESS:
        return { label: "In Progress", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" };
      case TASK_STATUS.COMPLETE:
        return { label: "Completed", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-700", dot: "bg-gray-500" };
    }
  };

  const statusConfig = getStatusConfig(task.status);

  const handleSave = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: { progress, links, attachments }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
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

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[950px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}></span>
                  {statusConfig.label}
                </span>
                <span className="text-xs text-gray-500 font-medium">Category - <span className="text-blue-600 font-semibold">{task.category || "General"}</span></span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateTaskMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updateTaskMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-white to-slate-50/50">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left Column - Main Info */}
            <div className="flex-1 space-y-6">

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Progress Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Progress</span>
                  <span className="text-lg font-bold text-gray-900">{progress}%</span>
                </div>
                {isEditing ? (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                ) : (
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${task.status === TASK_STATUS.COMPLETE ? 'bg-emerald-500' :
                        task.status === TASK_STATUS.IN_PROGRESS ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(task.assignedDate || task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase">Due Date</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Attachments</h3>
                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <span className="animate-pulse">Uploading...</span>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add File
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
                {attachments.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="relative group">
                        {!isImageFile(attachment.url) ? (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors h-32"
                          >
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate">{attachment.name}</span>
                          </a>
                        ) : (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          </a>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xs font-medium px-2 text-center">{attachment.name}</span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveAttachment(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 pointer-events-auto z-10"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No attachments</p>
                )}
              </div>

              {/* Links Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Reference Links</h3>
                </div>
                {links.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex-1 truncate"
                        >
                          {link.title}
                        </a>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveLink(index)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Link title"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddLink}
                      className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                )}
                {!isEditing && links.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No links</p>
                )}
              </div>
            </div>

            {/* Right Column - People */}
            <div className="w-full lg:w-72 space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">

              {/* Assigned To */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Assigned To</h3>
                <div className="space-y-2">
                  {task.assignedTo?.length > 0 ? task.assignedTo.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm">
                          <span className="text-sm font-bold text-gray-600">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 italic">No one assigned</p>
                  )}
                </div>
              </div>

              {/* Assigned By */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Created By</h3>
                {task.assignedBy ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    {task.assignedBy.profilePicture ? (
                      <img src={task.assignedBy.profilePicture} alt={task.assignedBy.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm">
                        <span className="text-sm font-bold text-gray-600">
                          {task.assignedBy.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{task.assignedBy.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Unknown</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
