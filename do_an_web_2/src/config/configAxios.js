import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng đợi sau khi token được làm mới
const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(); // Chỉ tiếp tục request mà không cần trả token
    }
  });
  failedQueue = [];
};
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // const csrfToken = getCsrfToken();
    // if (csrfToken) {
    //   config.headers['X-CSRF-Token'] = csrfToken;
    // }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.config.url === "/auth/refreshToken" ||
      error.config.url === "/auth/login"
    ) {
      return Promise.reject(error);
    }
    if (error.response.data.code === 1) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return instance(error.config);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      isRefreshing = true;
      return new Promise((resolve, reject) => {
        instance
          .post("/auth/refreshToken")
          .then((response) => {
            processQueue(null);
            resolve(instance(error.config));
          })
          .catch((error) => {
            processQueue(error);
            reject(error);
            // window.location.href = "/";
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    if (error.response.data.code === 2) {
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
