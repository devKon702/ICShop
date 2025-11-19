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
    // Handle token expired
    if (
      response?.status === 401 &&
      response.data.code === JWT_CODE.TOKEN_EXPIRED &&
      !config?._retry
    ) {
      // Just refresh token request once for multiple 401 responses
      if (!isRefreshing) {
        config._retry = true;
        isRefreshing = true;
        // Call refresh token API
        // Success: update token in store -> retry original requests
        // Failure: call needlogin event
        authService
          .refresh()
          .then(({ data }) => {
            useAuthStore.getState().actions.setToken(data.token);
            // Retry all the queued requests with new token
            refreshSubscribers.forEach((cb) => cb(data.token));
          })
          .catch(() => {
            useAuthStore.getState().actions.clearAuth();
            window.dispatchEvent(new CustomEvent("needlogin"));
            // Reject all the queued requests with original error
            refreshSubscribers.forEach((cb) => cb(null));
          })
          .finally(() => {
            isRefreshing = false;
            refreshSubscribers = [];
          });
      }
      // Queue the requests that arrive during the token refresh process
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token) => {
          if (config && token) {
            config.headers!.Authorization = `Bearer ${token}`;
            resolve(apiAxios(config));
          }

          reject(err);
        });
      });
    }
    // Handle Unauthorized error
    else if (response?.status === 401) {
      useAuthStore.getState().actions.clearAuth();
      window.dispatchEvent(new CustomEvent("needlogin"));
    }
    return Promise.reject(err);
  }
);

export default apiAxios;
