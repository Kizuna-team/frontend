import axios from "@/api/axios.js";
export const fetchAllProfiles = async () => {
  try {
    const res = await axios.get("/users/profile");
    return res.data;
  } catch (error) {
    console.error("fetchAllProfiles 錯誤:", error);
    throw error;
  }
};

export const fetchProfile = async () => {
  try {
    const res = await axios.get("/profile/me");
    return res.data;
  } catch (error) {
    console.error("fetchProfile 錯誤:", error);
    throw error;
  }
};

export const fetchCertainProfile = async () => {
  try {
    const res = await axios.get("users/profile/:id");
    return res.data;
  } catch (error) {
    console.error("fetchCertainProfile 錯誤:", error);
    throw error;
  }
};

export const createProfileApi = async (data) => {
  try {
    const res = await axios.post("/profile/me", data);
    return res.data;
  } catch (error) {
    console.error("createProfileApi 錯誤:", error);
    throw error;
  }
};

export const updateProfileApi = async (data) => {
  try {
    const res = await axios.patch("/profile/me", data);
    return res.data;
  } catch (error) {
    console.error("updateProfileApi 錯誤:", error);
    throw error;
  }
};
