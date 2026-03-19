import nodeCron from "node-cron";
import sessionRepository from "../repositories/session.repository";
import { logger } from "../utils/logger.util";

export function startCleanUpSesssion() {
  // Run once at 2 AM
  nodeCron.schedule("0 2 * * *", async () => {
    logger.info("[CRON] Start cleanup expired session");
    await sessionRepository.deleteExpired();
    logger.info("[CRON] Finish cleanup");
  });
}
