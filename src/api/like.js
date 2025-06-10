import axios from "@/api/axios.js";
// 送出 like 並取得有無配對結果 不喜歡0 喜歡1
export const sendLike = async (targetId, status = 1) => {
  try {
    const res = await axios.post("/like", {
      targetId,
      status,
    });
    return res.data;
  } catch (err) {
    console.error("發送like失敗:", err);
    throw err;
  }
};

export const sendSuperLike = async (targetId) => {
  try {
    const res = await axios.post("/super-like", { targetId });
    return res.data;
  } catch (error) {
    console.error("發送super like失敗:", error);
    throw error;
  }
};

// 取得 Super Like 使用狀態
// { isMember, limit, remainingCount, isWithinLimit }
export const fetchSuperLikeStatus = async () => {
  try {
    const res = await axios.get("/super-like/status");
    return res.data;
  } catch (error) {
    console.error("取得該用戶的Super like 狀態失敗", error);
    throw error;
  }
};
