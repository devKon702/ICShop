import env from "@/constants/env";
import axios from "axios";

const apiPublic = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiPublic.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default apiPublic;
