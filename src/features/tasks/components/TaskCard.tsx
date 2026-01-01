import type { Task } from "../../../types/task.types";
import { TASK_STATUS, type TaskStatusType } from "../../../constants/task.constants";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onClick: (task: Task) => void;
}

export const TaskCard = ({ task, onDragStart, onClick }: TaskCardProps) => {
  const getCardBg = (status: TaskStatusType) => {
    switch (status) {
      case TASK_STATUS.TODO: return "bg-[#EAF3FF]";
      case TASK_STATUS.IN_PROGRESS: return "bg-[#FFF4E5]";
      case TASK_STATUS.COMPLETE: return "bg-[#E8F8F0]";
      default: return "bg-white";
    }
  };

  const getProgressColor = (status: TaskStatusType) => {
    switch (status) {
      case TASK_STATUS.TODO: return "bg-[#2E7DFF]";
      case TASK_STATUS.IN_PROGRESS: return "bg-[#FFA352]";
      case TASK_STATUS.COMPLETE: return "bg-[#2FB36B]";
      default: return "bg-blue-500";
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className={`p-4 rounded-[12px] cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 ${getCardBg(task.status)}`}
    >
      <h3 className="text-base font-bold text-gray-900 leading-snug mb-0.5 line-clamp-2">{task.title}</h3>
      <p className="text-[11px] font-medium text-gray-500/80 mb-3">Open for description</p>

      <div className="flex items-center mb-3.5">
        <div className="flex -space-x-3 overflow-hidden">
          {task.assignedTo?.length > 0 ? (
            task.assignedTo.map((user) => (
              user.profilePicture ? (
                <img
                  key={user.id}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white shadow-sm object-cover"
                  src={user.profilePicture}
                  alt={user.name}
                  title={user.name}
                />
              ) : (
                <div
                  key={user.id}
                  className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm bg-gray-200 flex items-center justify-center"
                  title={user.name}
                >
                  <span className="text-xs font-bold text-gray-600">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </span>
                </div>
              )
            ))
          ) : (
            <div className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">?</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-semibold text-gray-900">Progress</span>
          <div className="h-[4px] w-[90px] rounded-full bg-white/70 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${getProgressColor(task.status)}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-800">
          <img src="/icons/clock-icon.svg" alt="due date" className="h-[16px] w-[16px] opacity-70" />
          <span className="text-[11px] font-semibold text-[#1a1a1a]">
            {format(new Date(task.dueDate), 'd MMM yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};
