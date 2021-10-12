// 引用当前文件所有vue文件，循环注册全局组件
const context = require.context("./", true, /\.vue$/);

const install = (app) => {
  context.keys().forEach((key) => {
    const component = context(key).default;
    app.component(component.name, component);
  });
};
export default install;
