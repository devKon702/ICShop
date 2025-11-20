import { Session } from "@prisma/client";
import { prisma } from "../prisma";

class SessionRepository {
  public create = (data: {
    id: string;
    rtJti: string;
    userId: number;
    version?: number;
    expiresAt: Date;
  }) => {
    return prisma.session.create({
      data,
    });
  };

  public findById = (id: string) => {
    return prisma.session.findUnique({
      where: { id },
    });
  };

  public findManyByUserId = (userId: number) => {
    return prisma.session.findMany({
      where: { userId },
    });
  };

  public updateById = (
    id: string,
    data: Pick<Session, "rtJti" | "expiresAt" | "version">
  ) => {
    return prisma.session.update({
      where: { id },
      data,
    });
  };

  public deleteById = (id: string) => {
    return prisma.session.delete({
      where: { id },
    });
  };

  public deleteManyByIds = (ids: string[]) => {
    return prisma.session.deleteMany({
      where: { id: { in: ids } },
    });
  };
}

export default new SessionRepository();
