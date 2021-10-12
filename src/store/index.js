import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

// 获取modules所有store
const requireContext = require.context("./modules", false, /.*\.js$/);
const modules = requireContext
  .keys()
  .map((file) => [file.replace(/(^.\/)|(\.js$)/g, ""), requireContext(file)])
  .reduce((modules, [name, module]) => {
    const component = module.default || module;
    if (component.namespaced === undefined) {
      component.namespaced = true;
    }
    return { ...modules, [name]: component };
  }, {});
// 只储存state中的assessmentData
const persistedState = createPersistedState({
  paths: ["user"],
});

export default new createStore({
  modules,
  // 持久缓存
  plugins: [persistedState],
});
