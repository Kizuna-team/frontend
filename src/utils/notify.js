// src/utils/notify.js
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

//  漸層粉藍
const gradient = (msg = "通知") =>
  toast(msg, {
    type: "default",
    toastClassName: "toast-gradient",
    icon: false,
    autoClose: 1000,
    transition: "flip",
    position: "top-right",
    hideProgressBar: true,
  });

const kiwi = (msg = "通知") =>
  toast(msg, {
    type: "default",
    toastClassName: "toast-kiwi",
    icon: false,
    autoClose: 2000,
    position: "bottom-left",
    hideProgressBar: true,
  });

const warn = (msg = "通知") =>
  toast(msg, {
    type: "default",
    toastClassName: "toast-warn",
    icon: false,
    autoClose: 2000,
    position: "top-right",
    hideProgressBar: true,
  });

// loading，需手動更新
const loading = (msg = "處理中...") =>
  toast.loading(msg, {
    position: "bottom-center",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    toastClassName: "toast-kiwi",
  });

//  手動更新成功
const updateSuccess = (id, msg = "完成！") =>
  toast.update(id, {
    render: msg,
    type: "default",
    toastClassName: "toast-gradient",
    isLoading: false,
    autoClose: 1500,
    icon: false,
  });

// 手動更新失敗
const updateError = (id, msg = "失敗，請重試") =>
  toast.update(id, {
    render: msg,
    type: "default",
    toastClassName: "toast-orange",
    isLoading: false,
    autoClose: 3000,
    icon: false,
  });

// 通用客製型
const custom = (msg, options = {}) =>
  toast(msg, { type: "default", ...options });

export const notify = {
  gradient,
  kiwi,
  warn,
  loading,
  updateSuccess,
  updateError,
  custom,
};
