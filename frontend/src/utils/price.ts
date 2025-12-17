export function formatPrice(price: number | undefined): string {
  // const str = price.toLocaleString("vi-VN");
  // return str;
  const priceStr: string = price === undefined ? "0" : String(price);
  // return !!price ? price.toLocaleString("vi-VN") : "0";
  return priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getUnitPrice(
  quantity: number,
  wholesale: { min: number; price: string }[]
) {
  const sorted = [...wholesale].sort((a, b) => a.min - b.min);
  return Number(sorted.findLast((item) => item.min <= quantity)?.price) || 0;
}
