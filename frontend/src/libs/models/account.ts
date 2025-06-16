import { Role } from "@/libs/models/role";
import { User } from "@/libs/models/user";

export type Account = {
  id: number;
  email: string;
  roleId: string;
  isActive: boolean;
  isGoogleAuth: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  roleModel?: Role;
};
