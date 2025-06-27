import axios from "@/api/axios";
import { notify } from "@/utils/notify";

export const getPhotos = async () => {
  try {
    const res = await axios.get("/photos/me");
    return res.data;
  } catch (err) {
    console.error("getPhotos 錯誤:", err);
    throw err;
  }
};

export const getPublicPhotos = async () => {
  try {
    const res = await axios.get("/users/photos/:userId");
    return res.data;
  } catch (err) {
    console.error("getPublicPhotos 錯誤:", err);
    throw err;
  }
};

export const uploadPhoto = async (file, sequence = null, isAvatar = false) => {
  try {
    const formData = new FormData();

    formData.append("image", file);

    formData.append("isAvatar", isAvatar.toString());

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

export const changeAvatar = async (imageKey) => {
  try {
    await axios.patch("/photos/me/avatar", {
      key: imageKey,
    });
    notify.gradient("大頭貼已更新");
  } catch (err) {
    console.error("changeAvatar 錯誤", err);
    throw err;
  }
};

export const fetchTargetPhotos = async (userId) => {
  try {
    const res = await axios.get(`/photos/match/${userId}`);
    return res.data;
  } catch (err) {
    console.error("fetchTargetPhotos 錯誤:", err);
    throw err;
  }
};
