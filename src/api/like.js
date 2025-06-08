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
