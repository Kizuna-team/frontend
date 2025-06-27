import axios from "axios";
import { useUserStore } from "../stores/user.js";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const userStore = useUserStore();
    if (error.response?.status === 401 && userStore.refreshToken) {
      try {
        await userStore.refresh();
        error.config.headers.Authorization = `Bearer ${userStore.accessToken}`;
        return instance(error.config);
      } catch (refreshError) {
        userStore.logout();
        alert("請重新登入");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
