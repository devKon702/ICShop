import bcrypt from "bcrypt";
/** Số vòng tạo salt  */
const saltRounds = 10;

/**
 * Hàm mã hóa chuỗi
 * @param plainString chuổi cần mã hóa
 * @returns chuỗi đã mã hóa
 */
export async function hashString(plainString: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(plainString, salt);
  return hashed;
}

/**
 * Hàm so sánh chuỗi chưa mã hóa và chuỗi đã mã hóa
 * @param plainString Chuỗi gốc
 * @param hashedString Chuỗi đã mã hóa
 * @returns true nếu match, ngược lại là false
 */
export async function compareString(
  plainString: string,
  hashedString: string,
): Promise<boolean> {
  return await bcrypt.compare(plainString, hashedString);
}
