import { JWT_CODE } from "@/constants/api-code";
import env from "@/constants/env";
import { authService } from "@/libs/services/auth.service";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
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
            // localStorage.setItem("token", data.data);
            refreshSubscribers.forEach((cb) => cb(data.data));
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
            resolve(api(config));
          }

          reject(err.response);
        });
      });
    }
    return Promise.reject(err.response);
  }
);

export default api;
