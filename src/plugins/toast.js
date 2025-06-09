import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// 套件的選項設定
export const toastOptions = {
  position: "top-center",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false, // 顯示底部進度條
};

export default Toast;
