import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  // baseURL: "/api", // Next.js 프록시 사용 시 생략
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof config.url === "string" && config.url.startsWith("/api")) {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        if (!config.headers) config.headers = {} as any;
        if (typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${accessToken}`);
        } else {
          (config.headers as Record<string, string>)[
            "Authorization"
          ] = `Bearer ${accessToken}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
