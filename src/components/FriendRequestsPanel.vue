<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from '@/api/axios';

const emit = defineEmits(['friendConfirmed']);

const pendingRequests = ref([]);
const userId = localStorage.getItem("userId");

const fetchPendingFriendRequests = async () => {
  if (!userId) {
    console.error("無法獲取 userId，無法載入好友邀請。");
    return;
  }
  try {
    const response = await axios.get(`/api/friends/requests?userId=${userId}`);
    pendingRequests.value = response.data;
    console.log("成功獲取待處理好友邀請：", pendingRequests.value);
  } catch (error) {
    console.error('獲取好友邀請失敗:', error);
  }
};

const confirmFriendRequest = async (requestId, senderId, senderUsername) => {
  if (!userId) {
    console.error("無法獲取 userId，無法確認好友。");
    return;
  }
  try {
    await axios.post('/api/friends/accept', { 
      requestId: requestId,
      receiverId: userId,
      senderId: senderId
    });

    pendingRequests.value = pendingRequests.value.filter(req => req.id !== requestId);

    emit('friendConfirmed'); 

  } catch (error) {
    console.error('確認好友邀請失敗:', error);
    alert('發生錯誤，確認好友邀請失敗。');
  }
};

const rejectFriendRequest = async (requestId) => {
  console.log(`[Reject] 函數被觸發了，傳入的 requestId 是: ${requestId}`);
  console.log(`[Reject] 當前 userId 的值是: ${userId}`);

  if (!userId) {
    console.error("[Reject] userId 是空的！無法拒絕好友。");
    alert('發生錯誤，拒絕好友邀請失敗。(用戶ID缺失)'); 
    return;
  }
  
  console.log("[Reject] userId 存在，繼續執行後續邏輯。"); 

  try {
    const response = await axios.delete(`/api/friends/requests/${requestId}`); 
    console.log("[Reject] 後端響應狀態:", response.status); 
    console.log("[Reject] 後端響應數據:", response.data);   

    const originalLength = pendingRequests.value.length; 
    
    pendingRequests.value = pendingRequests.value.filter(req => {
        const match = Number(req.id) === Number(requestId); 
        if (match) {
            console.log(`[Reject] 找到匹配的邀請並將其移除：ID ${req.id}`);
        }
        return !match; 
    });

    const newLength = pendingRequests.value.length; 
    console.log(`[Reject] 更新後 pendingRequests 列表長度：${newLength} (原長度: ${originalLength})`);

    if (newLength < originalLength) {
        alert('好友邀請已拒絕。');
    } else {
        console.warn("[Reject] 警告：Filter 操作未移除任何邀請，請檢查傳入的 requestId 是否正確匹配列表中 request 的 id。");
        alert('操作完成，但好友邀請未從列表移除。請刷新頁面。');
    }

  } catch (error) {
    console.error('[Reject] 拒絕好友邀請失敗，捕捉到錯誤:', error);
    if (error.response) {
      console.error("[Reject] 後端錯誤響應狀態:", error.response.status);
      console.error("[Reject] 後端錯誤響應數據:", error.response.data);
      alert(`發生錯誤，拒絕好友邀請失敗。錯誤碼: ${error.response.status}`);
    } else if (error.request) {
      console.error("[Reject] 沒有收到後端響應 (請求已發出):", error.request);
      alert('發生錯誤，拒絕好友邀請失敗。(無後端響應)');
    } else {
      console.error("[Reject] 請求設置時發生錯誤:", error.message);
      alert(`發生錯誤，拒絕好友邀請失敗。(${error.message})`);
    }
  }
};

onMounted(() => {
  console.log("FriendRequestsPanel 元件掛載，開始獲取待處理邀請..."); 
  fetchPendingFriendRequests();
});
</script>

<template>
  <div class="friend-requests-container">
    <h3>待處理的好友邀請</h3>
    <ul id="pending-friend-requests" v-if="pendingRequests.length > 0">
      <li v-for="request in pendingRequests" :key="request.id" class="friend-request-item">
        <span class="sender-name">{{ request.from_username }}</span> 
        <div class="action-buttons">
          <button 
            @click="confirmFriendRequest(request.id, request.from_id, request.from_username)" 
            class="confirm-btn">
            確認
          </button>
          <button 
            @click="console.log('按鈕被點擊了！'); rejectFriendRequest(request.id)" 
            class="reject-btn">
            拒絕
          </button>
        </div>
      </li>
    </ul>
    <p v-else id="no-requests-message">目前沒有新的好友邀請。</p>
  </div>
</template>

<style scoped>
.friend-requests-container {
  width: 300px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-left: 20px;
  flex-shrink: 0;
}

.friend-requests-container h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

#pending-friend-requests {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.friend-request-item:last-child {
  border-bottom: none;
}

.sender-name {
  font-weight: bold;
  color: #555;
  flex-grow: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap;
}

.confirm-btn {
  background-color: #4CAF50;
  color: white;
}

.confirm-btn:hover {
  background-color: #45a049;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.reject-btn:hover {
  background-color: #da190b;
}

#no-requests-message {
  text-align: center;
  color: #777;
  padding: 10px;
}
</style>