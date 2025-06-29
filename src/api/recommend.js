import axios from "@/api/axios";

// 已包含篩選與放寬邏輯
export const fetchMatchedUsers = async (userId) => {
  try {
    const res = await axios.get(`/recommend/${userId}`);
    return res.data;
  } catch (error) {
    console.error("篩選對象失敗:", error);
    throw error;
  }
};
