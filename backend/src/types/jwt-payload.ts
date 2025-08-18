import { Role } from "../constants/db";

export type JwtPayload = {
  sub: number;
  role: Role;
};
