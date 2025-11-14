import bcrypt from "bcrypt";

const saltRounds = 10; // Số vòng tạo salt, 10 là khá phổ biến

// Mã hóa mật khẩu
export async function hashString(plainString: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(plainString, salt);
  return hashed;
}

// So sánh mật khẩu khi đăng nhập
export async function compareString(
  plainString: string,
  hashedString: string
): Promise<boolean> {
  return await bcrypt.compare(plainString, hashedString);
}
