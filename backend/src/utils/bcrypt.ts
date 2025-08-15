import bcrypt from "bcrypt";

const saltRounds = 10; // Số vòng tạo salt, 10 là khá phổ biến

// Mã hóa mật khẩu
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(plainPassword, salt);
  return hashed;
}

// So sánh mật khẩu khi đăng nhập
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
