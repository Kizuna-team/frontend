import axios from "@/api/axios.js";

//  Pinia store 裡引用並呼叫 fetchProfile()，把資料存進 userProfile
//  在元件裡使用 Pinia 的 getProfile() 方法來觸發

// GET 除了自己之外的所有使用者資料
export const fetchAllProfiles = async () => {
  try {
    const res = await axios.get("/users/profile");
    console.log("後端資料:", res.data);
    return res.data;
  } catch (error) {
    console.error("fetchAllProfiles 錯誤:", error);
    throw error;
  }
};

// GET 取得使用者個人編輯資料
export const fetchProfile = async () => {
  try {
    const res = await axios.get("/profile/me");
    return res.data;
  } catch (error) {
    console.error("fetchProfile 錯誤:", error);
    throw error;
  }
};

// GET 取得查看某人資料
export const fetchCertainProfile = async () => {
  try {
    const res = await axios.get("users/profile/:id");
    return res.data;
  } catch (error) {
    console.error("fetchCertainProfile 錯誤:", error);
    throw error;
  }
};

// POST 建立個人資料
export const createProfileApi = async (data) => {
  try {
    const res = await axios.post("/profile/me", data);
    return res.data;
  } catch (error) {
    console.error("createProfileApi 錯誤:", error);
    throw error;
  }
};

// Patch 更新使用者個人資料
export const updateProfileApi = async (data) => {
  try {
    const res = await axios.patch("/profile/me/", data);
    return res.data; // 只回傳user資料，不操作 store
  } catch (error) {
    console.error("updateProfileApi 錯誤:", error);
    throw error;
  }
};
