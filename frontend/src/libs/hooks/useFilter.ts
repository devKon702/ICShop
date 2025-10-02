import { useState, useEffect } from "react";

type FilterFn<T, K> = (item: T, query: K) => boolean;

export function useFilter<T, K>(
  originalData: T[],
  filterFn: FilterFn<T, K>,
  query: K
) {
  const [filteredData, setFilteredData] = useState<T[]>(originalData);

  useEffect(() => {
    const result = originalData.filter((item) => filterFn(item, query));
    setFilteredData(result);
  }, [query, originalData]);
  return filteredData;
}
