import { createRouter, createWebHistory } from "vue-router";
import store from "@/store"; //vuex
import Home from "@/page/home";
const middlewares = require.context("./middleware", false, /.*\.js$/);
const Mine = () => import("@/page/mine");
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/mine",
    name: "mine",
    component: Mine,
    meta: {
      newuser: false, //需要刷新个人信息
      middleware: "auth", //中间件
      keepAlive: true, // 是否缓存
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//获取中间件所有文件
const middleware = middlewares
  .keys()
  .map((file) => [file.replace(/(^.\/)|(\.vue$)/g, ""), middlewares(file)])
  .reduce((components, [name, component]) => {
    components[name] = component.default || component;
    return components;
  }, {});

//启动中间件
function middlewarefn(to, from, next) {
  const ismiddleware = to.meta.middleware;
  const context = {
    to,
    from,
    next,
    store,
  };
  return middleware[ismiddleware + ".js"]({
    ...context,
  });
}

// 路由监听每次跳转路由回到最上面
router.afterEach(() => {
  window.scrollTo(0, 0);
});
//路由监听
router.beforeEach((to, from, next) => {
  //是否需要更新信息请求
  if (to.meta.newuser) {
    store.dispatch("user/fetchUser");
  }
  if (!to.meta.middleware) {
    return next();
  }

  //启动中间件
  middlewarefn(to, from, next);
});

export default router;
