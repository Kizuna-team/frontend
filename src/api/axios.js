import axios from "axios";
import { useUserStore } from "@/stores/user.js";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

// 自訂義的 axios instance 在每次發送 req 時 會先被 axios提供的 interceptors 攔下來
// 都會檢查使用者是否有登入(有token?) 如果有就自動加上 Authorization header
instance.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`;
  }
  return config;
});


// 自訂義 axios instance 在每次得到 res 時 會先被 axios 提供的 interceptors 攔下來檢查
// 
// 成功時->
// 直接回傳 res 不用做任何加工處理
// 
// 失敗時(4xx,5xx)時->
// 進入 async{...} 區域 會先接住錯誤
// 然後取得 pinia 的使用者狀態
// 如果狀態是 401 Unauthorized (未授權) 且 有refreshToken (表示有登入過)
// 就嘗試刷新一下 有可能只是 accessToken 過期不能使用了(不是他沒資格)
// 將原本失敗的 req 的 header 更新成新的 access token
// 然後直接重發 req

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
    // 在 interceptors.response 的錯誤處理中 如果不是 401 或 refresh 失敗 
    // 必須回傳 Promise.reject(error) 否則 Vue 或 Pinia 端接不到錯誤訊息。 
    return Promise.reject(error);
  }
);

export default instance;
