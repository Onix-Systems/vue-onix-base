const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "OnixBase",
    themeColor: "#FFFFFF",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxOptions: {
      exclude: [/index\.html$/],
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
         @import '~@/scss/_colors.scss';
         `,
      },
    },
  },
});
