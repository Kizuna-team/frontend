import axios from "@/api/axios";

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

export const uploadPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/photos/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
    alert(" 大頭貼已更新 ");
  } catch (err) {
    console.error("changeAvatar 錯誤", err);
    throw err;
  }
};

// 撈取使用者大頭照
export const fetchTargetPhotos = async (userId) => {
  try {
    const res = await axios.get(`/photos/match/${userId}`);
    return res.data; // 是陣列：每張照片的 image_url / sequence 等
  } catch (err) {
    console.error("fetchTargetPhotos 錯誤:", err);
    throw err;
  }
};
