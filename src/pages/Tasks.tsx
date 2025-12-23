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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await tasksApi.getAll();
      setTasks(response.data);
      setLastUpdated(new Date());
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
      case TaskStatus.IN_PROGRESS: return "bg-[#FFF4E5]";
      case TaskStatus.COMPLETE: return "bg-[#E8F8F0]";
      default: return "bg-white";
    }
  };

  const getProgressColor = (status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.TODO: return "bg-[#2E7DFF]";
      case TaskStatus.IN_PROGRESS: return "bg-[#FFA352]";
      case TaskStatus.COMPLETE: return "bg-[#2FB36B]";
      default: return "bg-blue-500";
    }
  };

  const renderColumn = (status: TaskStatusType, label: string) => {
    const filteredTasks = tasks.filter((t: Task) => t.status === status);
    const getBadgeColor = (s: TaskStatusType) => {
      switch (s) {
        case TaskStatus.TODO: return "bg-[#2E7DFF]";
        case TaskStatus.IN_PROGRESS: return "bg-[#FFA352]";
        case TaskStatus.COMPLETE: return "bg-[#2FB36B]";
        default: return "bg-gray-500";
      }
    };

    return (
      <div
        className="flex flex-col gap-6 w-[400px] h-fit min-h-[200px] bg-white rounded-[24px] p-4 pt-6 shadow-sm border border-gray-100/50 pb-8"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-3">
            <span className={`px-5 py-2.5 rounded-2xl text-white font-bold text-base shadow-sm ${getBadgeColor(status)}`}>
              {label}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-sm font-bold text-gray-500 border border-gray-50">
              {filteredTasks.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <img src="/icons/more-horizontal.svg" alt="more" className="h-6 w-6 opacity-60" />
            </button>
            <button onClick={() => openAddModal(status)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <img src="/icons/plus-icon.svg" alt="add" className="h-6 w-6 opacity-80" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-1">
          {filteredTasks.map((task: Task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
              className={`p-5 rounded-[10px] cursor-grab active:cursor-grabbing hover:shadow-xl transition-all duration-300 ${getCardBg(status)}`}
            >
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{task.title}</h3>
              <p className="text-sm font-medium text-gray-500/80 mb-4">Open for description</p>

              <div className="flex items-center mb-5">
                <div className="flex -space-x-3 overflow-hidden">
                  {task.assignedTo?.length > 0 ? (
                    task.assignedTo.map((user) => (
                      <img
                        key={user.id}
                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white shadow-sm object-cover"
                        src={`https://i.pravatar.cc/150?u=${user.id}`}
                        alt={user.name}
                        title={user.name}
                      />
                    ))
                  ) : (
                    <img
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white shadow-sm object-cover"
                      src={`https://i.pravatar.cc/150?u=1`}
                      alt="Default"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-base font-bold text-gray-900">Progress</span>
                  <div className="h-[5px] w-[100px] rounded-full bg-white overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ease-out ${getProgressColor(status)}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-800">
                  <img src="/icons/calendar-icon.svg" alt="calendar" className="h-[20px] w-[20px]" />
                  <span className="text-sm font-bold text-[#1a1a1a]">
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
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <TasksHeader onRefresh={fetchTasks} lastUpdated={lastUpdated} />

        <div className="px-10 pt-6 pb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 opacity-60 tracking-tight">*drag and drop tasks from to-do till complete</p>
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md active:scale-[0.98]"
          >
            <img src="/icons/plus-icon.svg" alt="Add" className="h-4 w-8 invert brightness-0 filter" />
            Add Task
          </button>
        </div>

        <main className="flex-1 mx-6 mb-10 overflow-x-auto bg-[#f5f5f5] p-6 relative scrollbar-hide rounded-[20px]">
          <div className="flex gap-10 items-start justify-center">
            {renderColumn(TaskStatus.TODO, "To-Do")}
            {renderColumn(TaskStatus.IN_PROGRESS, "In Progress")}
            {renderColumn(TaskStatus.COMPLETE, "Complete")}
          </div>

          <div className="absolute bottom-10 left-10">
            <button
              className="flex items-center gap-3 px-8 py-3.5 bg-white rounded-[20px] shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 group border border-gray-100"
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
              <img src="/icons/delete-icon.svg" alt="trash" className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-bold text-gray-700">Trash</span>
            </button>
          </div>
        </main>

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