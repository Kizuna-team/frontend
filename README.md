# Kizuna｜交友配對網站（前端）

## 命名由來
「 Kizuna（絆） 」在日語中意為「 羈絆 」我們希望大家可以透過本網站 在這複雜的世界中 找到自己理想中的夥伴、朋友或伴侶  
我們致力於為大家牽起這條「 線 」讓原本毫無交集的人們 能夠 因線生緣 產生羈絆   
這邊先預祝大家可以透過本網站找到可以一起玩的好友、情人  

## 線上開始使用
[ 之後放部署網址 ]   
  
本專案為 Kizuna 交友網站的前端系統，您可以在完成「 註冊/登入(支援Google第三方登入) 」後，即可立即使用我們提供的多項服務，推薦流程建議先進入「 滑滑專區 」  
按下喜歡來和對方建立好友關係，成為好友後，您可以在「 商城下訂單 」給自己的好友，增加你們的親密度，禮物將會以 QRCODE形式 傳到對方的「 我的禮物 」  
成為好友後，將會為雙方「 開啟單獨聊天室 」，您可以在這和喜歡的人暢聊今天所發生的生活趣事  
另外，對於喜歡團體活動的E人們，我們也提供「新增活動揪團」功能  

<img width="1461" alt="截圖 2025-06-19 上午9 54 41" src="https://github.com/user-attachments/assets/ea7adcb5-b7bb-471a-a975-298bb6fb25c5" />

## 使用技術

  * `Vue.js 3`
  * `Pinia`
  * `Tailwind CSS`

## 如何安裝及執行這個專案

### 1. Clone 專案
```
git clone https://github.com/Kizuna-team/frontend.git
cd kizuna-frontend
```

### 2. 安裝依賴套件
```
npm install
```

### 3. 加入環境變數

請依據 `env.template`檔案提示加入相應的環境變數  
    
  
### 4. 啟動開發伺服器
```
npm run dev
```

## 開發相關規定

* 資料庫: `PostgreSQL`

* 使用 `Tailwind` 時，要下載 `VSCode` 的擴充功能(`extensions`) 「`Headwind`」這樣大家的 `class`中的`Tailwind`順序才會一樣  
![image](https://github.com/user-attachments/assets/488a73f4-b0e0-4d9c-8fb3-fd7a1cdcbd4d)

* 命名方式 以 使用者名稱 為例
  * 資料庫欄位請使用 蛇式命名法 ( snacke-case ) => user_name
  * `JavaScript` 使用 駝峰式命名法 => userName

* `.vue`檔案 請以 `<script setup> + Composition API` 撰寫

* `.env`環境變數設定

## 成員列表

* sin-huang [github](https://github.com/sin-huang)
  * 會員登入/註冊系統
  * 推薦顯示邏輯
  * 歷史紀錄

* chingyu0713 [github](https://github.com/chingyu0713)
  * 串金流系統

* c16033 [github](https://github.com/c16033)
  * 聊天室系統
  * 購物車系統

* Heidi [github](https://github.com/HeidiSiao)
  * 個人檔案管理(後端)
  * 配對頁面

* Yunie [github](https://github.com/hsinyuHsu)
  * 創建活動/揪團功能
  * 歷史紀錄

* Noid [github](https://github.com/Noiddddddd)
  * 個人檔案管理(前端)
  * 建立封鎖/檢舉資料庫

* wen-yu-tsai [github](https://github.com/wen-yu-tsai)
  * 購物車系統
  * 創建活動（前端）

* Jun-Liang-Guo [github](https://github.com/Jun-Liang-Guo)
  * 推薦顯示邏輯
  * 訂閱頁面切版
