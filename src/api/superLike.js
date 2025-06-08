import axios from "@/api/axios.js";

export const sendSuperLike = async (targetId) => {
  try {
    const res = await axios.post("/super-like", { targetId });
    return res.data;
  } catch (error) {
    console.error("發送super like失敗:", error);
    throw error;
  }
};
