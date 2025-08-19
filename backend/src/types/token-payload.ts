import { JwtPayload } from "jsonwebtoken";
import { Role } from "../constants/db";

export interface TokenPayload extends JwtPayload {
  sub: number;
  role: Role;
}
