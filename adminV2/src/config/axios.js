import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    token: `Bearer ${localStorage.getItem("token")}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === 403
    ) {
      console.error("Unauthorized: Token không hợp lệ hoặc không có token");
      window.location.href = "/authentication/sign-in";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
