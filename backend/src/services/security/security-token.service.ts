import { randomBytes } from "crypto";
import { SecurityAction } from "./security-token.constant";
import redisService, { redisKeys } from "../redis.service";

interface SecurityTokenPayload {
  action: SecurityAction;
  metadata: {
    userId?: number;
    email?: string;
    hashedPassword?: string;
    token?: string;
  };
}

class SecurityTokenService {
  /**
   * Hàm tạo và lưu token cho các hành động bảo mật
   * @param payload Data lưu theo token, chứa các trường cần thiết cho action
   * @param ttlSeconds Thời gian sống của token (giây)
   * @returns
   */
  public async create(
    payload: SecurityTokenPayload,
    ttlSeconds: number,
  ): Promise<{ expiresAt: Date; token: string }> {
    const token = randomBytes(32).toString("hex");
    await redisService.setValue(
      redisKeys.securityToken(token),
      payload,
      ttlSeconds,
    );
    return { expiresAt: new Date(Date.now() + ttlSeconds * 1000), token };
  }

  /**
   * Hàm xác thực token bảo mật
   * @param token Chuỗi token cần xác thực
   * @param expectedAction Hành động bảo mật mong đợi của token
   * @returns Data đã lưu theo token, throw lỗi nếu không tồn tại hoặc hành động bảo mật của token không match
   */
  public async verify(
    token: string,
    expectedAction: SecurityAction,
  ): Promise<SecurityTokenPayload | null> {
    const payload = await redisService.getValue<SecurityTokenPayload>(
      redisKeys.securityToken(token),
    );
    if (!payload || payload.action !== expectedAction) return null;
    return payload;
  }

  /**
   * Hàm thu hồi token
   * @param token Chuỗi token cần thu hồi
   */
  public async revoke(token: string) {
    await redisService.deleteKey(redisKeys.securityToken(token));
  }
}

export default new SecurityTokenService();
