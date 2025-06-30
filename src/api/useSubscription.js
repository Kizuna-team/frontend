import axios from "./axios";
import { useUserStore } from "@/stores/user";
import { useToast } from 'vue-toastification'

const toast = useToast()
export async function checkout(planId, price) {
  try {
    const response = await axios.post("/api/ecpay/create", { planId });

    const formHtml = response.data; 
    const div = document.createElement("div");
    div.innerHTML = formHtml;
    document.body.appendChild(div);

    const form = div.querySelector("form");
    if (form && form.action) {
      form.submit();
    } else {
      console.error("找不到綠界 form 或 action，回傳值錯：", formHtml);
      toast.error("訂閱失敗，綠界表單異常");
    }
  } catch (err) {
    toast.error("訂閱失敗！");
    console.error(err);
  }
}
