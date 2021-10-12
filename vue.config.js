const path = require("path");
console.log(process.env.VUE_APP_SERVER_URL);
module.exports = {
  assetsDir: "static",
  publicPath: "./",
  productionSourceMap: process.env.NODE_ENV === "development" ? true : false,
  outputDir:
    "build/" + (process.env.outputDir ? process.env.outputDir : "dist"),
  chainWebpack: (config) => {
    // 路径别名
    config.resolve.alias
      .set("@", path.resolve(__dirname, "./src"))
      .set("@img", path.resolve(__dirname, "./src/images"));
  },
  devServer: {
    // 环境配置
    host: "0.0.0.0", // 要设置当前访问的ip 否则失效
    port: 8080,
    open: true, //配置自动启动浏览器
    proxy: {
      //配置代理
      "/api": {
        target: process.env.VUE_APP_SERVER_URL, // 请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/variables.scss";`,
      },
    },
  },
};
