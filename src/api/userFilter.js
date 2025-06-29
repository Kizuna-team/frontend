import axios from "@/api/axios";

export const saveUserInterestsApi = (interestIds) => {
  return axios.post("/user-filter/interests", { interestIds });
};

export const saveUserPreferenceApi = ({
  musicMatch,
  introvertOrExtrovert,
  pet,
  wakeUpTime,
  ageMin,
  ageMax,
  gender,
  orientation,
}) => {
  return axios.post("/user-filter/preference", {
    musicMatch,
    introvertOrExtrovert,
    pet,
    wakeUpTime,
    ageMin,
    ageMax,
    gender,
    orientation: [0, 1, 2].includes(orientation) ? orientation : 2, // 預設傳 2 男女都可給後端
  });
};
