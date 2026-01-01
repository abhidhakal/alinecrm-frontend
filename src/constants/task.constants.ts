export const TASK_STATUS = {
  TODO: 'To-Do',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
} as const;

export type TaskStatusType = typeof TASK_STATUS[keyof typeof TASK_STATUS];
