import axios from "@/api/axios.js";
import { useCartStore } from "../stores/cart.js";
import { useUserStore } from "@/stores/user.js"; // 

// 改為接受動態參數（receiverId, message, paymentMethod）
const sendOrder = async ({ receiverId, message, paymentMethod }) => {
  const cartStore = useCartStore();
  const userStore = useUserStore();

  const senderId = userStore.userId || localStorage.getItem("userId"); 

  try {
    // 組成要送給 API 的 items 格式
    const items = cartStore.cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    console.log("要送出的資料：", {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      payment_method: paymentMethod,
      items
    });

    const res = await axios.post("/order/gift-orders", {
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      payment_method: paymentMethod,
      items
    });

    if (res.data.success) {
      console.log(res.data);
      // 成功後跳轉 LINE Pay 頁面
      window.location.href = res.data.paymentUrl;
    } else {
      message.value = "建立訂單失敗：" + res.data.message;
    }
    // console.log("跳轉到linepay掃描頁面，網址：", res.data.paymentUrl);
    // // 這行超重要：跳轉到 LINE Pay 頁面
    // window.location.href = res.data.paymentUrl;
  } catch (err) {
    console.error("送禮失敗 請稍後再試 失敗原因:", err);
    throw err; 
  }
};

export default sendOrder;
