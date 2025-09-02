import { API_ROUTE } from "@/constants/api-route";
import { Account } from "@/libs/models/account";

const login = async (email: string, password: string): Promise<Account> => {
  const res = await fetch(API_ROUTE.auth + "/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());

  return res as Account;
};

export const accountService = { login };
