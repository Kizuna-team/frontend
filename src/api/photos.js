import axios from "@/api/axios";

export const getPhotos = async () => {
  try {
    const res = await axios.get("/photos/me");
    return res.data;
  } catch (err) {
    console.error("getPhotos 錯誤:", err);
    throw err;
  }
};

// 取我的指定某張
export const getMyPhoto = async () => {
  try {
    const res = await axios.get("/users/photos/me");
    return res.data;
  } catch (err) {
    console.error("getMyPhoto 錯誤:", err);
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
