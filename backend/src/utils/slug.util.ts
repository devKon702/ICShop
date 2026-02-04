export const createSlug = (text: string) => {
  const baseSlug = text
    .normalize("NFD") // tách dấu tiếng Việt ra
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // xóa ký tự đặc biệt
    .replace(/\s+/g, "-") // thay khoảng trắng thành "-"
    .replace(/-+/g, "-"); // bỏ bớt dấu "-" trùng lặp
  const randomStr = Math.random().toString(36).substring(2, 7); // random 5 ký tự
  return `${baseSlug}-${randomStr}`;
};
