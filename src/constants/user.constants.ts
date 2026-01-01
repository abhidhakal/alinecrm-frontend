export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export type UserRoleType = typeof USER_ROLE[keyof typeof USER_ROLE];
