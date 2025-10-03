import { prisma } from "../prisma";

class AddressRepository {
  private readonly remoteApi = "https://provinces.open-api.vn/api/v1";

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
    return fetch(`${this.remoteApi}/p/`)
      .then((res) => res.json() as Promise<{ name: string; code: number }[]>)
      .then((data) =>
        data.map((province) => ({ name: province.name, code: province.code }))
      )
      .catch(() => null);
  };

  public findDistrictsByProvinceCode = async (provinceCode: number) => {
    return fetch(`${this.remoteApi}/p/${provinceCode}?depth=2`)
      .then(
        (res) =>
          res.json() as Promise<{
            districts: { name: string; code: number }[];
          }>
      )
      .then((data) =>
        data.districts.map((d) => ({ name: d.name, code: d.code }))
      )
      .catch(() => null);
  };

  public findCommunesByDistrictCode = async (districtCode: number) => {
    return fetch(`${this.remoteApi}/d/${districtCode}?depth=2`)
      .then(
        (res) =>
          res.json() as Promise<{ wards: { name: string; code: number }[] }>
      )
      .then((data) => data.wards.map((w) => ({ name: w.name, code: w.code })))
      .catch(() => null);
  };

  public findProvinceByCode = async (provinceCode: number) => {
    return fetch(`${this.remoteApi}/p/${provinceCode}`)
      .then((res) => res.json() as Promise<{ name: string; code: number }>)
      .then((data) => ({ name: data.name, code: data.code }))
      .catch(() => null);
  };
  public findDistrictByCode = async (districtCode: number) => {
    return fetch(`${this.remoteApi}/d/${districtCode}`)
      .then((res) => res.json() as Promise<{ name: string; code: number }>)
      .then((data) => ({ name: data.name, code: data.code }))
      .catch(() => null);
  };
  public findCommuneByCode = async (communeCode: number) => {
    return fetch(`${this.remoteApi}/w/${communeCode}`)
      .then((res) => res.json() as Promise<{ name: string; code: number }>)
      .then((data) => ({ name: data.name, code: data.code }))
      .catch(() => null);
  };
}

export default new AddressRepository();
