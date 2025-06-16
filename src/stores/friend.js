import { defineStore } from "pinia";
import axios from "@/api/axios"; 
import { ref } from "vue";

export const useFriendStore = defineStore("friend", () => {
  const friendList = ref([]);

  const fetchFriendList = async (userId) => {
    try {
      const res = await axios.get(`/friends?userId=${userId}`);
      friendList.value = res.data; 
    } catch (err) {
      console.error("取得好友列表失敗", err);
    }
  };

  return {
    friendList,
    fetchFriendList,
  };
});