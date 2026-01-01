export const CONTACT_PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export type ContactPriorityType = typeof CONTACT_PRIORITY[keyof typeof CONTACT_PRIORITY];
