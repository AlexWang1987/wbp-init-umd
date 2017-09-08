module.exports = function(umdConf) {
  // node
  // umdConf.webpackFeatures.enableNode();
  umdConf.webpackFeatures.enableClean();
  umdConf.webpackFeatures.enableHits();

  // umdConf.webpackFeatures.enableVendors();
  // umdConf.addVendor('react');
  // umdConf.addVendor('react-dom');

  // umdConf.addParseInclude(require.resolve('react'))
  // umdConf.addParseInclude(require.resolve('react-dom'))
  // umdConf.addParseInclude(require.resolve('antd'))
};