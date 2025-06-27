const options = {
  position: "top-center",
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false,
  icon: true,
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  toastDefaults: {
    success: {
      timeout: 1500,
    },
    error: {
      timeout: 2000,
    },
  },
};

export { options };
