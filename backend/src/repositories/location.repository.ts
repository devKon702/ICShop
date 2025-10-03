import { LocationType } from "../constants/db";
import { prisma } from "../prisma";

class LocationRepository {
  public findAllProvinces = async () => {
    return prisma.location.findMany({ where: { type: LocationType.PROVINCE } });
  };

  public findDistrictsByProvinceId = async (provinceId: number) => {
    return prisma.location.findMany({
      where: { type: LocationType.DISTRICT, parentId: provinceId },
    });
  };

  public findWardByDistrictId = async (districtId: number) => {
    return prisma.location.findMany({
      where: { type: LocationType.WARD, parentId: districtId },
    });
  };

  public findLocationById = async (id: number, type?: LocationType) => {
    return prisma.location.findUnique({ where: { id, type } });
  };
}

export default new LocationRepository();
