import Cookies from "js-cookie";
import * as types from "../mutation-types";

// state永久存储的个人数据
const state = {
  user: "fsdfasfd",
  token: "312321",
};

// getters
const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
};

// mutations
const mutations = {
  //存储token
  [types.SAVE_TOKEN](state, { token }) {
    state.token = token;
  },
  //存储个人信息
  [types.FETCH_USER_SUCCESS](state, { user }) {
    state.user = user;
  },
  //移除token
  [types.FETCH_USER_FAILURE](state) {
    state.token = null;
    Cookies.remove("token");
  },
  //退出删除个人信息和token
  [types.LOGOUT](state) {
    state.user = null;
    state.token = null;
    console.log("删除信息");
    Cookies.remove("token");
  },
};

// actions
const actions = {
  saveToken({ commit }, payload) {
    commit(types.SAVE_TOKEN, payload);
  },
  // 获取登入用户信息
  async fetchUser({ commit }) {
    const { token } = state;
    if (token) {
      commit(types.LOGOUT);
      // try {
      //   const { data } = await axios.get(api.user);
      //   commit(types.FETCH_USER_SUCCESS, { user: data.data });
      // } catch (e) {
      //   commit(types.LOGOUT);
      // }
    }
  },
  // 退出删除个人信息  user  token
  async logout({ commit }) {
    commit(types.LOGOUT);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
