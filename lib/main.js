/*eslint-disable*/
var fs = require('promisify-fs');
var git = require('promisify-git');
var Promise = require('bluebird');

/* wbp plugin */
module.exports = function wbpplugin() {
  /**
   * wbp plugin context
   * @param  {string}  __plugindir  plugin's absolute path
   * @param  {string}  info         utils log info
   * @param  {string}  warn         utils log warn
   * @param  {string}  error        utils log error
   * @param  {function}  call       wbp plugin-call interface
   */
  var cx = context = this;

  return Promise.each([
    fs.cloneFolder(cx.__plugindir + '/assets/*', cx.__cwd),
    git.initGit({
      gcwd: cx.__cwd
    }),

  ], function (taskItem) {
    return taskItem;
  });

};

