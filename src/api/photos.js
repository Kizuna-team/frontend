import axios from "@/api/axios";

export const getPhotos = async () => {
  try {
    const res = await axios.get("/photos");
    return res.data;
  } catch (err) {
    console.error("getPhotos 錯誤:", err);
    throw err;
  }
};

export const uploadPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/photos", formData, {
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
    await axios.delete(`/photos/${key}`);
  } catch (err) {
    console.error("deletePhoto 錯誤:", err);
    throw err;
  }
};
