import SearchCombobox from "@/components/common/search-combobox";
import locationService from "@/libs/services/location.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type LocationSelectorProps = {
  onProvinceChange: (provinceId: number | undefined) => void;
  onDistrictChange: (districtId: number | undefined) => void;
  onWardChange: (wardId: number | undefined) => void;
  initialProvinceId?: number;
  initialDistrictId?: number;
  initialWardId?: number;
};

export default function LocationSelector({
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  initialProvinceId,
  initialDistrictId,
  initialWardId,
}: LocationSelectorProps) {
  const [provinceId, setProvinceId] = useState(initialProvinceId);
  const [districtId, setDistrictId] = useState(initialDistrictId);
  const [wardId, setWardId] = useState(initialWardId);
  const { data: provincesResponse, isFetching: isFetchingProvinces } = useQuery(
    {
      queryKey: ["provinces"],
      queryFn: () => locationService.getProvinces(),
    }
  );

  const {
    data: districtsResponse,
    isFetching: isFetchingDistricts,
    refetch: refetchDistricts,
  } = useQuery({
    queryKey: ["districts", { provinceId: provinceId }],
    queryFn: () =>
      provinceId
        ? locationService.getDistricts(provinceId)
        : Promise.resolve(null),
  });
  const {
    data: wardsResponse,
    isFetching: isFetchingWards,
    refetch: refetchWards,
  } = useQuery({
    queryKey: ["wards", { districtId: districtId }],
    queryFn: () =>
      districtId ? locationService.getWards(districtId) : Promise.resolve(null),
  });

  //   useEffect(() => {
  //     if (
  //       provinceId === initialProvinceId &&
  //       districtId === initialDistrictId &&
  //       wardId === initialWardId
  //     )
  //       return;
  //     setDistrictId(undefined);
  //     setWardId(undefined);
  //     refetchDistricts();
  //     onProvinceChange(provinceId);
  //     console.log(provinceId?.toString() || "undefined");
  //   }, [
  //     provinceId,
  //     refetchDistricts,
  //     onProvinceChange,
  //     initialProvinceId,
  //     initialDistrictId,
  //     initialWardId,
  //   ]);

  //   useEffect(() => {
  //     if (districtId === initialDistrictId) return;
  //     setWardId(undefined);
  //     refetchWards();
  //     onDistrictChange(districtId);
  //     console.log(districtId?.toString() || "undefined");
  //   }, [
  //     districtId,
  //     refetchWards,
  //     onDistrictChange,
  //     initialDistrictId,
  //     initialWardId,
  //   ]);

  //   useEffect(() => {
  //     if (wardId === initialWardId) return;
  //     onWardChange(wardId);
  //     console.log(wardId?.toString() || "undefined");
  //   }, [wardId, onWardChange, initialWardId]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Tỉnh / Thành phố (*)</label>
        <SearchCombobox
          tabIndex={0}
          searchPlaceholder="Chọn tỉnh thành"
          list={
            isFetchingProvinces
              ? []
              : provincesResponse?.data.map((province) => ({
                  value: province.id,
                  label: province.name,
                })) || []
          }
          className="w-full"
          initialValue={provinceId}
          onItemSelect={(item) => {
            setProvinceId(item.value);
            setDistrictId(undefined);
            setWardId(undefined);
            refetchDistricts();
            onProvinceChange(item.value);
          }}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Quận huyện (*)</label>
        <SearchCombobox
          tabIndex={0}
          searchPlaceholder="Chọn quận huyện"
          list={
            isFetchingDistricts
              ? []
              : districtsResponse?.data.map((district) => ({
                  value: district.id,
                  label: district.name,
                })) || []
          }
          className="w-full"
          initialValue={districtId}
          onItemSelect={(item) => {
            setDistrictId(item.value);
            setWardId(undefined);
            refetchWards();
            onDistrictChange(item.value);
          }}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Phường xã (*)</label>
        <SearchCombobox
          tabIndex={0}
          searchPlaceholder="Chọn phường xã"
          list={
            isFetchingWards
              ? []
              : wardsResponse?.data.map((ward) => ({
                  value: ward.id,
                  label: ward.name,
                })) || []
          }
          className="w-full"
          initialValue={wardId}
          onItemSelect={(item) => {
            setWardId(item.value);
            onWardChange(item.value);
          }}
        />
      </div>
    </div>
  );
}
