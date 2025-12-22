import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TasksHeader from "../components/TasksHeader";
import TaskModal from "../components/TaskModal";
import AddTaskModal from "../components/AddTaskModal";
import { useSidebar } from "../context/SidebarContext";
import { tasksApi, TaskStatus, type Task, type TaskStatusType } from "../api/tasks";

export default function Tasks() {
  const { isExpanded } = useSidebar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<TaskStatusType>(TaskStatus.TODO);

  const fetchTasks = async () => {
    try {
      const response = await tasksApi.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, newStatus: TaskStatusType) => {
    const taskIdString = e.dataTransfer.getData("taskId");
    if (!taskIdString) return;
    const taskId = parseInt(taskIdString);
    const task = tasks.find((t: Task) => t.id === taskId);

    if (task && task.status !== newStatus) {
      // Optimistic update
      const updatedTasks = tasks.map((t: Task) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);

      try {
        await tasksApi.update(taskId, { status: newStatus });
        fetchTasks(); // Refresh to get latest state from server
      } catch (error) {
        console.error("Failed to update task status:", error);
        fetchTasks(); // Rollback on error
      }
    }
  };

  const openAddModal = (status: TaskStatusType = TaskStatus.TODO) => {
    setInitialStatus(status);
    setIsAddModalOpen(true);
  };

  const getCardBg = (status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.TODO: return "bg-[#EAF3FF]";
      case TaskStatus.IN_PROGRESS: return "bg-[#FFEBD6]";
      case TaskStatus.COMPLETE: return "bg-[#DDF5E6]";
      default: return "bg-white";
    }
  };

  const getProgressColor = (status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.TODO: return "bg-[#2F80ED]";
      case TaskStatus.IN_PROGRESS: return "bg-[#F2994A]";
      case TaskStatus.COMPLETE: return "bg-[#27AE60]";
      default: return "bg-blue-500";
    }
  };

  const renderColumn = (status: TaskStatusType, label: string) => {
    const filteredTasks = tasks.filter((t: Task) => t.status === status);
    const getBadgeColor = (s: TaskStatusType) => {
      switch (s) {
        case TaskStatus.TODO: return "bg-[#2F80ED]";
        case TaskStatus.IN_PROGRESS: return "bg-[#F2994A]";
        case TaskStatus.COMPLETE: return "bg-[#27AE60]";
        default: return "bg-gray-500";
      }
    };

    return (
      <div
        className="flex flex-col gap-2 w-[450px] h-fit min-h-[180px] bg-white rounded-[16px] p-3 shadow-md border border-gray-100/50 pb-4"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-xl text-white font-semibold text-[15px] shadow-sm ${getBadgeColor(status)}`}>
              {label}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-xs font-semibold text-black border border-gray-100">
              {filteredTasks.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <img src="/icons/more-horizontal.svg" alt="more" className="h-5 w-5 opacity-40" />
            </button>
            <button onClick={() => openAddModal(status)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <img src="/icons/plus-icon.svg" alt="add" className="h-5 w-5 opacity-60" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-1">
          {filteredTasks.map((task: Task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
              className={`p-5 rounded-[16px] cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-300 ${getCardBg(status)}`}
            >
              <h3 className="text-[17px] font-bold text-foreground leading-snug mb-1">{task.title}</h3>
              <p className="text-[13px] font-medium text-muted mb-5">Open for description</p>

              <div className="flex items-center mb-6">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {[1, 2, 3].map((_, i) => (
                    <img
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white shadow-sm object-cover"
                      src={`https://i.pravatar.cc/150?u=${task.id}-${i}`}
                      alt="avatar"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-[13px] font-bold text-gray-900">Progress</span>
                  <div className="h-[6px] w-[80px] rounded-full bg-white/60 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ease-out rounded-full ${getProgressColor(status)}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-800">
                  <img src="/icons/calendar-icon.svg" alt="calendar" className="h-4 w-4 opacity-60" />
                  <span className="text-[12px] font-bold text-gray-700">
                    {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-white relative font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[90px] max-w-[calc(100vw-110px)]'}`}>
        <TasksHeader onRefresh={fetchTasks} />

        <div className="flex-1 p-4 h-[calc(100vh-88px)]">
          <main className="w-full h-full bg-[#f5f5f5] rounded-[16px] p-6 relative flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8 px-2">
              <p className="text-xs font-bold text-muted opacity-70 tracking-tight">*drag and drop tasks from to-do till complete</p>
              <div className="flex flex-row gap-4">
                <button
                onClick={() => openAddModal()}
                className="flex items-center gap-2 rounded-xl bg-white-700 border border-border px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-[0.98]"
              >
                <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 filter" />
                Add Card
              </button>
                <button
                onClick={() => openAddModal()}
                className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-[0.98]"
              >
                <img src="/icons/task-icon-filled.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
                Add Task
              </button>
              </div>
            </div>

            {/* Columns */}
            <div className="flex-1 overflow-x-auto scrollbar-hide pb-4">
              <div className="flex gap-8 items-start justify-center h-full min-w-fit mx-auto">
                {renderColumn(TaskStatus.TODO, "To-Do")}
                {renderColumn(TaskStatus.IN_PROGRESS, "In Progress")}
                {renderColumn(TaskStatus.COMPLETE, "Complete")}
              </div>
            </div>

            {/* Delete Button */}
            <div className="absolute bottom-5 left-5">
              <button
                className="flex items-center gap-3 px-8 py-3.5 bg-white rounded-[16px] shadow-lg hover:shadow-xl transition-all hover:bg-red-50 group border border-gray-100 hover:border-[#D64545]"
                onDragOver={onDragOver}
              onDrop={async (e) => {
                const taskIdString = e.dataTransfer.getData("taskId");
                if (!taskIdString) return;
                const taskId = parseInt(taskIdString);
                if (taskId) {
                  try {
                    await tasksApi.delete(taskId);
                    fetchTasks();
                  } catch (error) {
                    console.error("Failed to delete task:", error);
                  }
                }
              }}
            >
                <img src="/icons/delete-icon.svg" alt="trash" className="h-6 w-6 text-black transition-all group-hover:invert-[15%] group-hover:sepia-[95%] group-hover:saturate-[6932%] group-hover:hue-rotate-[358deg] group-hover:contrast-[109%] group-hover:text-red-600" />
                <span className="text-[16px] font-bold text-foreground group-hover:text-red-600 transition-colors">Delete</span>
              </button>
            </div>
          </main>
        </div>

        <TaskModal
          isOpen={isModalOpen}
          task={selectedTask}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />

        <AddTaskModal
          isOpen={isAddModalOpen}
          initialStatus={initialStatus}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchTasks}
        />
      </div>
    </div>
  );
}