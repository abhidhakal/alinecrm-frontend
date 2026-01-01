import { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import TasksHeader from "../../features/tasks/components/TasksHeader";
import TaskModal from "../../features/tasks/components/TaskModal";
import AddTaskModal from "../../features/tasks/components/AddTaskModal";
import AdminViewBanner from "../../features/admin/components/AdminViewBanner";
import { useSidebar } from "../../context/SidebarContext";
import { useGetAllTasks, useUpdateTask, useDeleteTask } from "../../api/tasks.api";
import { TASK_STATUS } from "../../constants/task.constants";
import type { TaskStatusType } from "../../constants/task.constants";
import type { Task } from "../../types/task.types";
import { TaskColumn } from "../../features/tasks/components/TaskColumn";

export default function AdminTasks() {
  const { isExpanded } = useSidebar();

  // React Query Hooks
  const { data: tasks = [], refetch } = useGetAllTasks();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Local UI State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<TaskStatusType>(TASK_STATUS.TODO);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const onDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = async (e: React.DragEvent, newStatus: TaskStatusType) => {
    const taskIdString = e.dataTransfer.getData("taskId");
    if (!taskIdString) return;
    const taskId = parseInt(taskIdString);
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      await updateTaskMutation.mutateAsync({ id: taskId, data: { status: newStatus } });
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTaskMutation.mutateAsync(id);
    }
  };

  const openAddModal = (status: TaskStatusType = TASK_STATUS.TODO) => {
    setInitialStatus(status);
    setIsAddModalOpen(true);
  };

  const columns = [
    { status: TASK_STATUS.TODO, label: "To-Do" },
    { status: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
    { status: TASK_STATUS.COMPLETE, label: "Complete" }
  ];

  return (
    <div className="flex min-h-screen w-full bg-white relative font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <TasksHeader
          onRefresh={refetch}
          lastUpdated={new Date()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          title="Admin Tasks"
        />

        <section className="px-8">
          <AdminViewBanner
            label="Viewing all tasks across all users"
            stats={`${tasks.length} Total Tasks`}
          />
        </section>

        <div className="px-10 pt-6 pb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 opacity-60 tracking-tight">*drag and drop tasks from to-do till complete</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-2 rounded-xl bg-white border border-border px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
            >
              <img src="/icons/task-icon-filled.svg" alt="Add" className="h-5 w-5" />
              Add Card
            </button>
            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md active:scale-[0.98]"
            >
              <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
              Add Task
            </button>
          </div>
        </div>

        <main className="flex-1 mx-6 mb-10 overflow-x-auto bg-[#f5f5f5] p-6 relative scrollbar-hide rounded-[20px]">
          <div className="flex gap-10 items-start justify-center">
            {columns.map(col => (
              <TaskColumn
                key={col.status}
                status={col.status}
                label={col.label}
                tasks={filteredTasks.filter(t => t.status === col.status)}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragStart={onDragStart}
                onTaskClick={(t) => {
                  setSelectedTask(t);
                  setIsTaskModalOpen(true);
                }}
                onAddTask={openAddModal}
              />
            ))}
          </div>

          <div className="absolute bottom-5 left-5">
            <button
              className="flex items-center gap-3 px-8 py-3.5 bg-white rounded-[20px] shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 group border border-gray-100"
              onDragOver={onDragOver}
              onDrop={async (e) => {
                const taskIdString = e.dataTransfer.getData("taskId");
                if (!taskIdString) return;
                const taskId = parseInt(taskIdString);
                if (taskId) handleDeleteTask(taskId);
              }}
            >
              <img src="/icons/delete-icon.svg" alt="trash" className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-bold text-gray-700">Trash</span>
            </button>
          </div>
        </main>

        <TaskModal
          isOpen={isTaskModalOpen}
          task={selectedTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
        />

        <AddTaskModal
          isOpen={isAddModalOpen}
          initialStatus={initialStatus}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
}
