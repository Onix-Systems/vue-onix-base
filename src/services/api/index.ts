import axios from "axios";
import store from "@/store";
import router from "@/router";

interface Subscriber {
  (token: string): void;
}

const baseURL = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : ``;
const axiosClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
let subscribers: Subscriber[] = [];
let isRefreshing = false;

function onRefreshed(accessToken: string): void {
  subscribers.map((cb) => cb(accessToken));
}

function subscribeTokenRefresh(cb: Subscriber): void {
  subscribers.push(cb);
}

axiosClient.interceptors.request.use(
  (request) => {
    if (request.headers && store.state.user.accessToken) {
      request.headers.Authorization = `Bearer ${store.state.user.accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    const refreshToken: string | null = store.state.user.refreshToken;
    if (error.response.status === 401) {
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          axios
            .post(`${baseURL}/auth/refresh-token`, {
              refreshToken: refreshToken,
            })
            .then((response) => {
              const { accessToken, refreshToken } =
                response.data.data.attributes;
              store.commit("user/setTokens", { accessToken, refreshToken });
              isRefreshing = false;
              onRefreshed(accessToken);
              subscribers = [];
            })
            .catch(() => {
              store.commit("user/clear");
              router.push("/login");
            });
        }
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          });
        });
      } else {
        store.commit("user/clear");
        router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
