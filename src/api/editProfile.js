// 純 API 工具方法，從 store 裡主動「呼叫」它，接收資料並存起來
// 所有 API 請求放在獨立的模組，store 呼叫後再更新狀態
import axios from "@/api/axios";

// GET 取得使用者個人資料
export const fetchProfile = async () => {
  try {
    const res = await axios.get("/api/edit-profile");
    return res.data;
  } catch (error) {
    console.error("fetchProfile 錯誤:", error);
    throw error;
  }
};

//  Pinia store 裡引用並呼叫 fetchProfile()，把資料存進 userProfile
//  在元件裡使用 Pinia 的 getProfile() 方法來觸發

// PUT 更新使用者個人資料
export const updateProfile = async (newData) => {
  try {
    const res = await axios.put("/api/edit-profile", newData);
    return res.data; // 只回傳user資料，不操作 store
  } catch (error) {
    console.error("updateProfile 錯誤:", error);
    throw error;
  }
};
