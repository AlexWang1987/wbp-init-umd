module.exports = function (umdConf) {
  umdConf.devServer.host = '0.0.0.0';
  umdConf.output.publicPath = '';

  umdConf.webpackFeatures.enableEntryHTML();
  umdConf.webpackFeatures.enableEntryHTML('test');

  if (umdConf.devMode) {
    umdConf.webpackFeatures.enableEntryHot('main');
    umdConf.webpackFeatures.enableEntryHot('test');
  } else {
    umdConf.webpackFeatures.enableUglifyJs({
      comments: false
    });
  }
};

