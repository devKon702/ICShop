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
