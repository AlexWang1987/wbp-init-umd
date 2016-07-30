module.exports = function (umdConf) {
  // enableHotReload
  umdConf.enableHotReplacement('main');

  // addExternal

  // all dependencies are added as venders default
  // umdConf.addVendor(Object.keys(umdConf.pkg.dependencies).map(function (depen_name) {
  //   return require.resolve(depen_name);
  // }));
};

