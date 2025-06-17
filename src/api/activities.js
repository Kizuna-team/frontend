import axios from "./axios";


export const fetchActivities = async () => {
  try {
    const res = await axios.get("/activities");
    return res.data;
  } catch (err) {
    console.error("取得活動列表失敗", err);
    throw err;
  }
};