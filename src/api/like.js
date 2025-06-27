import axios from "@/api/axios.js";

export const sendLike = async (targetId, status = 1) => {
  try {
    const res = await axios.post("/like/", {
      targetId,
      status,
    });

    if (res.data.matched) {
      return {
        matched: true,
        targetProfile: res.data.targetProfile,
        myProfile: res.data.myProfile,
        message: res.data.message,
      };
    }

    return {
      matched: false,
      message: res.data.message,
    };
  } catch (err) {
    console.error("發送like失敗:", err);
    throw err;
  }
};

export const sendSuperLike = async (targetId) => {
  try {
    const res = await axios.post("/like/super-like", {
      targetId,
    });

    // 成功就直接回傳資料
    return {
      matched: true,
      forcedMatched: true,
      targetProfile: res.data.targetProfile,
      myProfile: res.data.myProfile,
      message: res.data.message,
      roomId: res.data.roomId,
      remainingCount: res.data.remainingCount,
    };
  } catch (error) {
    console.error("發送 super like 失敗:", error);
    throw error;
  }
};

export const fetchSuperLikeStatus = async () => {
  try {
    const res = await axios.get("/like/super-like/status");
    return res.data;
  } catch (error) {
    console.error("取得該用戶的Super like 狀態失敗", error);
    throw error;
  }
};
