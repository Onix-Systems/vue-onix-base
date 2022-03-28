module.exports = {
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
        prependData: `
         @import '~@/scss/_colors.scss';
         `,
      },
    },
  },
};
