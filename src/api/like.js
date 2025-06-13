import axios from "@/api/axios.js";

// 送出 like 並取得有無配對結果 不喜歡0 喜歡1

export const sendLike = async (targetId, status = 1) => {
  try {
    const res = await axios.post("/like/", {
      targetId,
      status,
    });

    if (res.data.matched) {
      const matchedTargetId = res.data.matchedTargetId;
      // 用對方ID請求對方資料
      const matchedTargetRes = await axios.get(`/profile/${matchedTargetId}`);
      const matchedTarget = matchedTargetRes.data; // 沒有用user包

      return {
        matched: true,
        matchedTarget, // 剛從 /users/:id 拿到的
      };
    }
    return { matched: false }; // 不是雙向喜歡
  } catch (err) {
    console.error("發送like失敗:", err);
    throw err;
  }
};

export const sendSuperLike = async (targetId) => {
  try {
    const res = await axios.post("like/super-like", { targetId });

    if (res.data.matched) {
      const matchedTargetId = res.data.matchedTargetId;
      const matchedTargetRes = await axios.get(`/profile/${matchedTargetId}`);
      const matchedTarget = matchedTargetRes.data;

      return {
        matched: true,
        matchedTarget,
      };
    }

    return { matched: false };
  } catch (error) {
    console.error("發送 super like 失敗:", error);
    throw error;
  }
};

// 取得 Super Like 使用狀態
// { isMember, limit, remainingCount, isWithinLimit }
export const fetchSuperLikeStatus = async () => {
  try {
    const res = await axios.get("like/super-like/status");
    return res.data;
  } catch (error) {
    console.error("取得該用戶的Super like 狀態失敗", error);
    throw error;
  }
};
