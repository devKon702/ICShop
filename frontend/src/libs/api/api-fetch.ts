import env from "@/constants/env";

export async function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "default",
  });
}
