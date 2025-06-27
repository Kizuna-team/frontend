import axios from "@/api/axios.js";
import { useCartStore } from "../stores/cart.js";
import { useUserStore } from "../stores/user.js";

const sendOrder = async (receiverId, messageText) => {
  const cartStore = useCartStore();
  const userStore = useUserStore();

  try {
    const items = cartStore.cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const res = await axios.post("/order/gift-orders", {
      sender_id: userStore.userId,
      receiver_id: receiverId,
      items: items,
      message: messageText,
    });

    if (res.data.success) {
      // 成功後跳轉 LINE Pay 頁面
      window.location.href = res.data.paymentUrl;
    } else {
      message.value = "建立訂單失敗：" + res.data.message;
    }
  } catch (err) {
    console.error("送禮失敗 請稍後再試 失敗原因:", err);
  }
};

export default sendOrder;
