import { prisma } from "../prisma";

class AddressRepository {
  public findByUserId = async (userId: number) => {
    return prisma.address.findMany({
      where: { userId },
    });
  };

  public create = async (data: {
    userId: number;
    alias: string;
    receiverPhone: string;
    receiverName: string;
    detail: string;
    commune: string;
    communeCode: number;
    district: string;
    districtCode: number;
    province: string;
    provinceCode: number;
  }) => {
    return prisma.address.create({
      data,
    });
  };

  public update = async (
    addressId: number,
    data: {
      alias: string;
      receiverPhone: string;
      receiverName: string;
      detail: string;
      commune: string;
      communeCode: number;
      district: string;
      districtCode: number;
      province: string;
      provinceCode: number;
    }
  ) => {
    return prisma.address.update({ data, where: { id: addressId } });
  };
  public delete = async (id: number) => {
    return prisma.address.delete({ where: { id } });
  };

  public findById = async (id: number) => {
    return prisma.address.findUnique({ where: { id } });
  };

  public findAllProvinces = async () => {
    return fetch("https://provinces.open-api.vn/api/p/").then(
      (res) => res.json() as Promise<{ name: string; code: number }[]>
    );
  };

  public findDistrictsByProvinceCode = async (provinceCode: number) => {
    return fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(
        (res) =>
          res.json() as Promise<{
            districts: { name: string; code: number }[];
          }>
      )
      .then((data) => data.districts)
      .catch(() => null);
  };

  public findCommunesByDistrictCode = async (districtCode: number) => {
    return fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(
        (res) =>
          res.json() as Promise<{ wards: { name: string; code: number }[] }>
      )
      .then((data) => data.wards)
      .catch(() => null);
  };

  public findProvinceByCode = async (provinceCode: number) => {
    return fetch(`https://provinces.open-api.vn/api/p/${provinceCode}`)
      .then((res) => res.json() as Promise<{ name: string; code: number }>)
      .catch(() => null);
  };
  public findDistrictByCode = async (districtCode: number) => {
    return fetch(`https://provinces.open-api.vn/api/d/${districtCode}`)
      .then((res) => res.json() as Promise<{ name: string; code: number }>)
      .catch(() => null);
  };
  public findCommuneByCode = async (communeCode: number) => {
    return fetch(`https://provinces.open-api.vn/api/w/${communeCode}`)
      .then((res) => res.json() as Promise<{ name: string; code: number }>)
      .catch(() => null);
  };
}

export default new AddressRepository();
