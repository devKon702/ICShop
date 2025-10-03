import { PrismaClient, Prisma } from "@prisma/client";
import { LocationType } from "../src/constants/db";

const prisma = new PrismaClient();

interface Province {
  code: string;
  name: string;
}

interface ProvinceData extends LocationData {
  districts?: DistrictData[];
}

interface DistrictData extends LocationData {
  wards?: LocationData[];
}

interface LocationData {
  code: string;
  name: string;
  division_type: string;
  codename: string;
}

export async function fetchProvinces(): Promise<Province[]> {
  const res = await fetch("https://provinces.open-api.vn/api/v1");
  if (!res.ok) throw new Error("Failed to fetch provinces");
  return res.json();
}

export async function fetchProvinceDetail(code: string): Promise<ProvinceData> {
  const res = await fetch(
    `https://provinces.open-api.vn/api/v1/p/${code}?depth=3`
  );
  if (!res.ok) throw new Error("Failed to fetch province detail");
  return res.json();
}

export async function createLocationHierarchy(location: ProvinceData) {
  // Create Province
  const province = await prisma.location.create({
    data: {
      name: location.name,
      type: LocationType.PROVINCE,
    },
  });
  // Create Districts
  if (location.districts && location.districts.length > 0) {
    for (const district of location.districts) {
      const createdDistrict = await prisma.location.create({
        data: {
          name: district.name,
          type: LocationType.DISTRICT,
          parentId: province.id,
        },
      });

      // Create Wards
      if (district.wards && district.wards.length > 0) {
        for (const ward of district.wards) {
          await prisma.location.create({
            data: {
              name: ward.name,
              type: LocationType.WARD,
              parentId: createdDistrict.id,
            },
          });
        }
      }
    }
  }

  return province;
}

async function main() {
  const provinces = await fetchProvinces();
  for (const province of provinces) {
    const detail = await fetchProvinceDetail(province.code);
    await createLocationHierarchy(detail);
    console.log(`Imported: ${detail.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
