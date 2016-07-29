/*eslint-disable*/
var fs = require('promisify-fs');
var git = require('promisify-git');
var github = require('promisify-github');
var npm = require('promisify-npm');
var form = require('inquirer').createPromptModule();
var Promise = require('bluebird');
var path = require('path');

/**
 * plugin context
 */
var context, cx;

/**
 * wbp plugin context (cx)
 * @param {string}  __plugindir  plugin's absolute path
 * @param {string}  __cwd        working directory
 * @param {string}  __name       current plugin's name
 * @param {string}  info         utils log info
 * @param {string}  warn         utils log warn
 * @param {string}  error        utils log error
 * @param {function}  call       wbp plugin-call interface
 */
module.exports = function wbpplugin() {
  context = cx = this;
  return createUMDModule()
    .then(function () {
      return getProjectInfo();
    })
    .then(function () {
      return initGitRepo();
    })
    .then(function () {
      return createGithubRepo()
        .then(function (github_repo_path) {
          if (github_repo_path) {
            return git('remote add origin ' + github_repo_path)
              .catch(function () {
                cx.warn('Git remote [origin] may already exist.')
              })
          }
        })
    })
    .then(function () {
      return initNpm();
    })
    .then(function () {
      return submitInitialCommit()
        .catch(function () {
          cx.warn('The repo may be submitted the initial commit before.')
        })
    });
};

/**
 * getProjectInfo
 * @return promise
 */
var projectInfo = {};

function getProjectInfo() {
  var defaultProject = path.basename(cx.__cwd);
  return form([{
      message: 'Project Name:',
      type: 'input',
      name: 'name',
      default: defaultProject
    }, {
      message: 'Project Description:',
      type: 'input',
      name: 'description',
      default: 'A UMD Web Module.'
    }])
    .then(function (formAnswers) {
      return projectInfo = formAnswers;
    })
}

/**
 * createUMDModule
 * @return promise
 */
function createUMDModule() {
  return Promise
    .delay(2000)
    .then(function () {
      return fs.cloneFolder([
        cx.__plugindir + '/assets/*',
        cx.__plugindir + '/assets/.*'
      ], cx.__cwd)
    })
}

/**
 * initGitRepo
 * @return promise
 */
function initGitRepo() {
  return git.initGit({
    gcwd: cx.__cwd
  })
}

/**
 * createGithubRepo
 * @return promise
 */
function createGithubRepo() {
  return form([{
      message: 'Create Repo On Remote(Github):',
      type: 'confirm',
      name: 'comfirm',
      default: true
    }])
    .then(function (formAnswers) {
      if (formAnswers.comfirm) {
        return github
          .newRepo(projectInfo.name, projectInfo.description)
          .catch(function (e) {
            cx.warn('You may have to deal with it manually.');
          })
      } else {
        cx.warn('createGithubRepo ignore.');
      }
    })
}

/**
 * initNpm
 * @return promise
 */
function initNpm() {
  return npm.initDefaultPkg(cx.__cwd, {
    name: projectInfo.name,
    description: projectInfo.description,
    author: process.env['USER'] || '',
    main: 'dist/main.js',
    version: '0.0.0',
    scripts: {
      "test": "test/index.js"
    },
    keywords: [projectInfo.name],
    dependencies: {},
    wbp: {
      project: 'umd',
      entries: {
        main: 'main.js'
      },
      source: 'src/',
      build: 'dist/',
    },
    keywords: [projectInfo.name],
    license: "MIT"
  })
}

/**
 * submitInitialCommit
 * @return promise
 */
function submitInitialCommit() {
  return git('add .')
    .then(function () {
      return git('commit -m "Commit Initial - UMD"')
    })
    .catch(function (e) {
      cx.warn('submitInitialCommit got error');
    })
}

