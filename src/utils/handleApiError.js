import { notify } from "@/utils/notify";

export const handleApiError = async (fn, isNotify = true, customMsg = {}) => {
  try {
    return await fn();
  } catch (error) {
    if (isNotify) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message;

      const message =
        (typeof customMsg === "object" && customMsg[status]) ||
        (typeof customMsg === "string" ? customMsg : serverMsg);

      console.log("handleApiError 通知訊息：", message);

      switch (status) {
        case 400:
          notify.warn(message || "請確認欄位是否輸入正確");
          break;
        case 401:
          notify.warn(message || "請先登入");
          break;
        case 403:
          notify.warn(message || "尚未被授權執行此操作");
          break;
        case 404:
          notify.warn(message || "查無此資料");
          break;
        case 409:
          notify.warn(message || "已重複操作");
          break;
        case 500:
          notify.warn(message || "伺服器錯誤，請稍後再試");
          break;
        default:
          notify.warn(message || "操作失敗");
      }
    }
    throw error;
  }
};

export default handleApiError;
