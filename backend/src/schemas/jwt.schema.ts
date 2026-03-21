import { z } from "zod";
import { Role } from "../constants/db";

export const RefreshTokenPayloadSchema = z.object({
  jti: z.string(),
  sub: z.number(),
  role: z.nativeEnum(Role),
  sessionId: z.string(),
  version: z.number(),
});

export const AccessTokenPayloadSchema = z.object({
  sub: z.number(),
  role: z.nativeEnum(Role),
  sessionId: z.string(),
  sessionVersion: z.number(),
});
