export function safeStringify(obj: any) {
  JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
}

/**
 * Hàm che đi một phần thông tin email,
 * @returns Chuỗi giữ lại 1 kí tự đầu và 1 kí tự cuối (ex: n***k@gmail.com)
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split("@");

  if (!username || !domain) {
    throw new Error("Invalid email");
  }

  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }

  const first = username[0];
  const last = username[username.length - 1];
  const masked = "*".repeat(username.length - 2);

  return `${first}${masked}${last}@${domain}`;
}
