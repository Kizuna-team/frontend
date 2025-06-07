// 純 API 工具方法，從 store 裡主動「呼叫」它，接收資料並存起來
// 所有 API 請求放在獨立的模組，store 呼叫後再更新狀態
// 名字叫 axios（實際上是 instance）
import axios from "@/api/axios.js";

//  Pinia store 裡引用並呼叫 fetchProfile()，把資料存進 userProfile
//  在元件裡使用 Pinia 的 getProfile() 方法來觸發
// GET 取得使用者個人資料
export const fetchProfile = async () => {
  try {
    const res = await axios.get("/profile");
    return res.data;
  } catch (error) {
    console.error("fetchProfile 錯誤:", error);
    throw error;
  }
};

export const createProfileApi = async (data) => {
  try {
    const res = await axios.post("/profile", data);
    return res.data;
  } catch (error) {
    console.error("createProfileApi 錯誤:", error);
    throw error;
  }
};
// Patch 更新使用者個人資料
export const updateProfileApi = async (data) => {
  try {
    const res = await axios.patch("/profile", data);
    return res.data; // 只回傳user資料，不操作 store
  } catch (error) {
    console.error("updateProfileApi 錯誤:", error);
    throw error;
  }
};
