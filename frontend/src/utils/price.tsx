export function formatPrice(price: number | undefined): string {
  // const str = price.toLocaleString("vi-VN");
  // return str;
  return !!price ? price.toLocaleString("vi-VN") : "0";
}

export function getUnitPrice(
  quantity: number,
  wholesale: { min: number; price: string }[]
) {
  const sorted = [...wholesale].sort((a, b) => a.min - b.min);
  return Number(sorted.findLast((item) => item.min <= quantity)?.price) || 0;
}
