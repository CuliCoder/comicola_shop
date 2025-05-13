import axios from "axios";
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-control-allow-origin": import.meta.env.VITE_API_URL,
    "Access-Control-Allow-Credentials": true,
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
      return new Promise((resolve, reject) => {
        instance
          .post("/auth/refreshToken")
          .then((response) => {
            resolve(instance(error.config));
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
