import { Role } from "../constants/db";
import sessionRepository from "../repositories/session.repository";
import { RefreshTokenPayload } from "./jwt.service";
import redisService, { redisKeys } from "./redis.service";

class SessionService {
  private SESSION_CACHE_TTL_SECONDS = 2 * 60 * 60; // 2 hours
  public saveNewSession = async ({
    sessionId,
    refreshJti,
    userId,
    refreshExpiresAt,
  }: {
    sessionId: string;
    refreshJti: string;
    userId: number;
    refreshExpiresAt: Date;
  }) => {
    const session = await sessionRepository.create({
      id: sessionId,
      rtJti: refreshJti,
      userId: userId,
      version: 1,
      expiresAt: refreshExpiresAt,
    });
    await redisService.setValue(
      redisKeys.session(sessionId),
      {
        rtJti: refreshJti,
        userId: userId,
        sessionId: sessionId,
        version: 1,
      },
      this.SESSION_CACHE_TTL_SECONDS
    );
    return session;
  };
  public getOrLoadSession(
    sessionId: string,
    role: Role
  ): Promise<RefreshTokenPayload | null> {
    return redisService
      .getValue<RefreshTokenPayload>(redisKeys.session(sessionId))
      .then((data) => {
        if (data) return data;
        return sessionRepository.findById(sessionId).then(async (session) => {
          if (!session) {
            return null;
          }
          const sessionData: RefreshTokenPayload = {
            jti: session.rtJti,
            sub: session.userId,
            role: role,
            sessionId: session.id,
            version: session.version,
          };
          // Save to redis for next time
          await redisService.setValue(
            redisKeys.session(session.id),
            sessionData,
            this.SESSION_CACHE_TTL_SECONDS
          );
          return sessionData;
        });
      });
  }
  public updateSessionAndSync = async (payload: {
    sessionId: string;
    version: number;
    role: Role;
    rtJti: string;
    expiresAt: Date;
  }) => {
    // Update session in database then redis
    const sessionUpdated = await sessionRepository.updateById(
      payload.sessionId,
      {
        rtJti: payload.rtJti,
        version: payload.version,
        expiresAt: payload.expiresAt,
      }
    );
    await redisService.setValue(
      redisKeys.session(sessionUpdated.id),
      {
        sub: sessionUpdated.userId,
        role: payload.role,
        jti: sessionUpdated.rtJti,
        sessionId: sessionUpdated.id,
        version: sessionUpdated.version,
      },
      this.SESSION_CACHE_TTL_SECONDS
    );
  };
}

export default new SessionService();
