import { JWT_CODE } from "@/constants/api-code";
import env from "@/constants/env";
import { authService } from "@/libs/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const apiAxios = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiAxios.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ code: string }>) => {
    const response = err.response;
    const config = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (
      response?.status === 401 &&
      response.data.code === JWT_CODE.TOKEN_EXPIRED &&
      !config?._retry
    ) {
      if (!isRefreshing) {
        config._retry = true;
        isRefreshing = true;
        authService
          .refresh()
          .then(({ data }) => {
            useAuthStore.getState().actions.setToken(data.token);
            refreshSubscribers.forEach((cb) => cb(data.token));
          })
          .catch(() => {
            window.dispatchEvent(new CustomEvent("needlogin"));
            refreshSubscribers.forEach((cb) => cb(null));
          })
          .finally(() => {
            isRefreshing = false;
            refreshSubscribers = [];
          });
      }
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token: string | null) => {
          if (config && token) {
            // config?.headers?.Authorization = `Bearer ${token}`;
            config.headers!.Authorization = `Bearer ${token}`;
            resolve(apiAxios(config));
          }

          reject(err);
        });
      });
    } else if (
      response?.status === 401 &&
      response.data.code === JWT_CODE.TOKEN_MISSING
    ) {
      window.dispatchEvent(new CustomEvent("needlogin"));
    }
    return Promise.reject(err);
  }
);

export default apiAxios;
