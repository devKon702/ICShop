export function formatPrice(price: number | undefined): string {
  // const str = price.toLocaleString("vi-VN");
  // return str;
  return !!price ? price.toLocaleString("vi-VN") : "0";
}
