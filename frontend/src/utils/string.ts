import { emailRegex, phoneRegex } from "@/utils/regex";

export const getIdFromString = (str: string | null) => {
  return str ? str.split(",").map((id) => Number(id.trim())) : [];
};

export const getZaloLinkFromPhone = (phone: string) => {
  if (phoneRegex().test(phone) === false) return null;
  return `https://zalo.me/${phone}`;
};

export const getMailLinkFromEmail = (email: string) => {
  if (emailRegex().test(email) === false) return null;
  return `https://mail.google.com/mail/u/0/?fs=1&to=${email}&tf=cm`;
};

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD") // tách ký tự gốc và dấu (ví dụ: "ắ" → "a" + "◌́")
    .replace(/[\u0300-\u036f]/g, "") // xóa toàn bộ dấu tổ hợp
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export const containsIgnoreCaseAndAccents = (str1: string, str2: string) => {
  const normalize = (str: string) =>
    removeVietnameseTones(str).toLowerCase().trim();
  return normalize(str1).includes(normalize(str2));
};
