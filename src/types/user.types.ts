import type { UserRoleType } from "../constants/user.constants";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
  profilePicture?: string;
  currency?: string;
}

export type CreateUserDto = {
  name: string;
  email: string;
  password?: string;
  role: UserRoleType;
};

export type UpdateUserDto = Partial<CreateUserDto> & {
  profilePicture?: string;
  currency?: string;
};
