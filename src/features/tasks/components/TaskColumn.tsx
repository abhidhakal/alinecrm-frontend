import type { Task } from "../../../types/task.types";
import { TASK_STATUS } from "../../../constants/task.constants";
import type { TaskStatusType } from "../../../constants/task.constants";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  status: TaskStatusType;
  label: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatusType) => void;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatusType) => void;
}

export const TaskColumn = ({
  status,
  label,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  onTaskClick,
  onAddTask
}: TaskColumnProps) => {
  const getBadgeColor = (s: TaskStatusType) => {
    switch (s) {
      case TASK_STATUS.TODO: return "bg-[#2E7DFF]";
      case TASK_STATUS.IN_PROGRESS: return "bg-[#FFA352]";
      case TASK_STATUS.COMPLETE: return "bg-[#2FB36B]";
      default: return "bg-gray-500";
    }
  };

  return (
    <div
      className="flex flex-col w-[360px] max-h-[calc(100vh-260px)] h-fit bg-white rounded-[20px] p-4 pt-5 shadow-sm border border-gray-100/70"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-1.5 px-1.5">
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-2xl text-white font-bold text-sm shadow-sm ${getBadgeColor(status)}`}>
            {label}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-xs font-bold text-gray-500 border border-gray-100">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
            <img src="/icons/more-horizontal.svg" alt="more" className="h-5 w-5 opacity-60" />
          </button>
          <button onClick={() => onAddTask(status)} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
            <img src="/icons/plus-icon.svg" alt="add" className="h-5 w-5 opacity-80" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto no-scrollbar flex flex-col gap-3 px-1 pb-3 mt-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};
