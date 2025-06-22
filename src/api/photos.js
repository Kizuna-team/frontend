import axios from "@/api/axios";
import { useToast } from "vue-toastification";
const toast = useToast();

// 取我的所有照片
export const getPhotos = async () => {
  try {
    const res = await axios.get("/photos/me");
    return res.data;
  } catch (err) {
    console.error("getPhotos 錯誤:", err);
    throw err;
  }
};

// 取他人指定的公開照
export const getPublicPhotos = async () => {
  try {
    const res = await axios.get("/users/photos/:userId");
    return res.data;
  } catch (err) {
    console.error("getPublicPhotos 錯誤:", err);
    throw err;
  }
};

// 只拿來上傳生活照（含 sequence）
export const uploadPhoto = async (file, sequence = null, isAvatar = false) => {
  try {
    const formData = new FormData();

    formData.append("image", file);

    //  傳給後端「這是不是大頭照」 記得轉成字串
    formData.append("isAvatar", isAvatar.toString());

    //  有 sequence 才傳（生活照才需要）
    if (sequence !== null) {
      formData.append("sequence", sequence);
    }

    const res = await axios.post("/photos/me", formData);
    return res.data;
  } catch (err) {
    console.error("uploadPhoto 錯誤:", err);
    throw err;
  }
};

export const deletePhoto = async (key) => {
  try {
    await axios.delete(`/photos/me/${key}`);
  } catch (err) {
    console.error("deletePhoto 錯誤:", err);
    throw err;
  }
};

// 更換大頭照
export const changeAvatar = async (imageKey) => {
  try {
    await axios.patch("/photos/me/avatar", {
      key: imageKey,
    });
    toast(" 大頭貼已更新 ");
  } catch (err) {
    console.error("changeAvatar 錯誤", err);
    throw err;
  }
};

// 撈取他人大頭照
export const fetchTargetPhotos = async (userId) => {
  try {
    const res = await axios.get(`/photos/match/${userId}`);
    return res.data; // 陣列：每張照片的 image_url / sequence 等
  } catch (err) {
    console.error("fetchTargetPhotos 錯誤:", err);
    throw err;
  }
};
