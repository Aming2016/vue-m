import axios from "axios";
import stroe from "@/store";
import router from "@/router";
import QS from "qs";
// 从localStorage中获取token
function getLocalToken() {
  return stroe.state.user.token;
}

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
instance.setToken = (token) => {
  instance.defaults.headers["X-Token"] = token;
  stroe.dispatch("user/saveToken", { token });
};

function refreshToken() {
  // instance是当前request.js中已创建的axios实例
  return instance.post("/refreshtoken");
}

// 创建一个axios实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Token": getLocalToken(), // headers塞token
  },
});

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];

instance.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code === 1234) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            const { token } = res.data;
            instance.setToken(token);
            config.headers["X-Token"] = token;
            config.baseURL = "";
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach((cb) => cb(token));
            requests = [];
            return instance(config);
          })
          .catch((res) => {
            stroe.dispatch("user/logout");
            router.push("/login");
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((token) => {
            config.baseURL = "";
            config.headers["X-Token"] = token;
            resolve(instance(config));
          });
        });
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function get(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.data));
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, QS.stringify(params))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.data));
  });
}
export default instance;
