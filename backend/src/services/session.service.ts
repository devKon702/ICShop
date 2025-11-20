import { Role } from "../constants/db";
import sessionRepository from "../repositories/session.repository";
import { RefreshTokenPayload } from "./jwt.service";
import redisService, { redisKeys } from "./redis.service";

class SessionService {
  public getOrLoadSession(
    sessionId: string,
    role: Role
  ): Promise<RefreshTokenPayload | null> {
    return redisService
      .getValue<RefreshTokenPayload>(redisKeys.session(sessionId))
      .then((data) => {
        if (data) return data;
        return sessionRepository.findById(sessionId).then((session) => {
          if (!session) return null;
          const sessionData: RefreshTokenPayload = {
            jti: session.rtJti,
            sub: session.userId,
            role: role,
            sessionId: session.id,
            version: session.version,
          };
          // Save to redis for next time
          redisService.setValue(
            redisKeys.session(session.id),
            sessionData,
            60 * 60 * 4 // 4 hours
          );
          return sessionData;
        });
      });
  }
}

export default new SessionService();
