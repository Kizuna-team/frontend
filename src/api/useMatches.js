import axios from "@/api/axios.js";

export const useSendFriendMsg = () => {
  const sendFriendMsg = async (targetId) => {
    try {
      const res = await axios.post("/matches", { targetId });

      const roomId = res.data.roomId;
      if (!roomId) throw new Error("roomId 不存在");
      return roomId;
    } catch (error) {
      console.error("建立好友失敗:", error);
      throw error;
    }
  };

  return { sendFriendMsg };
};
