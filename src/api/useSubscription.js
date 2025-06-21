import axios from "./axios";
import { useUserStore } from "@/stores/user";

export async function checkout(planId, price) {
  try {
    // 0609 melody 如果登入後才會出現會員專區（現在是這樣）那其實不用以下這段
    // const store = useUserStore();
    // if (!store.accessToken) {
    //   toast.error("請先登入！");
    //   return;
    // }
    // if (price === 0) {
    //   toast("免費方案無需訂閱");
    //   return;
    // }

    // 呼叫後端api建立訂單(綠界表單) 實作在後端的 backend/routes/ecpay.js
    const response = await axios.post("/api/ecpay/create", { planId });
    console.log(response);

    const formHtml = response.data; //後端送過來的form

    // 把綠界表單插入畫面 並設定自動送出
    const div = document.createElement("div");
    div.innerHTML = formHtml;
    document.body.appendChild(div);

    const form = div.querySelector("form");
    // 把綠界給的表單印出來看看
    console.log(form);
    if (form && form.action) {
      form.submit();
    } else {
      console.error("❌ 找不到綠界 form 或 action，回傳值錯：", formHtml);
      toast.error("訂閱失敗，綠界表單異常");
    }
  } catch (err) {
    toast.error("訂閱失敗！");
    console.error(err);
  }
}
