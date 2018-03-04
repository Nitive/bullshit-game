module.exports = {
  plugins: [
    require('postcss-cssnext')({
      url: false,
      features: {
        customProperties: {
          warnings: false
        }
      },
    }),
  ],
};
