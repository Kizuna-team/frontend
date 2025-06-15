const options = {
  // 基本設定
  position: 'top-center',     // 顯示位置
  timeout: 3000,              // 3秒後自動消失
  closeOnClick: true,         // 點擊可關閉
  pauseOnHover: true,         // 滑鼠懸停時暫停
  hideProgressBar: false,     // 顯示進度條
  icon: true,                 // 顯示圖示
  transition: "Vue-Toastification__bounce",  // 彈跳動畫
  maxToasts: 20,
  // 各類型專用設定
  toastDefaults: {
    success: {
      timeout: 3000,
    },
    error: {
      timeout: 5000, //error的設久一點
    },
  }
}

export { options }