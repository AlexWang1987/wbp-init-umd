module.exports = function (umdConf) {
  umdConf.devServer.host = '0.0.0.0';
  umdConf.webpackFeatures.enableEntryHTML();
  umdConf.output.publicPath = '';

  if (umdConf.devMode) {
    umdConf.webpackFeatures.enableEntryHot();
  } else {
    umdConf.webpackFeatures.enableUglifyJs({
      comments: false
    });
  }
};

