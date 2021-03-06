try{require("source-map-support").install();}
catch(err) {}
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _async = __webpack_require__(2);
	
	var _async2 = _interopRequireDefault(_async);
	
	var _mixinDeep = __webpack_require__(3);
	
	var _mixinDeep2 = _interopRequireDefault(_mixinDeep);
	
	var _githubBase = __webpack_require__(4);
	
	var _githubBase2 = _interopRequireDefault(_githubBase);
	
	var _dataStore = __webpack_require__(5);
	
	var _dataStore2 = _interopRequireDefault(_dataStore);
	
	var _parseGithubUrl = __webpack_require__(6);
	
	var _parseGithubUrl2 = _interopRequireDefault(_parseGithubUrl);
	
	var _askForGithubAuth = __webpack_require__(7);
	
	var _askForGithubAuth2 = _interopRequireDefault(_askForGithubAuth);
	
	var _stringifyAuthor = __webpack_require__(8);
	
	var _stringifyAuthor2 = _interopRequireDefault(_stringifyAuthor);
	
	var _githubContributors = __webpack_require__(9);
	
	var _githubContributors2 = _interopRequireDefault(_githubContributors);
	
	var store = new _dataStore2['default']('update-contributors');
	
	/**
	 * Pulldown github contributors and update the `contributors` property
	 * in the provided package.json object.
	 *
	 * ```js
	 * var pkg = require('./package.json');
	 * update(pkg, function (err, results) {
	 *   if (err) return console.error(err);
	 *   console.log(reults);
	 *   //=> updated package.json object
	 * });
	 * ```
	 *
	 * @param  {Object} `pkg` Object representing the package.json to update.
	 * @param  {Object} `options` Options to use for github authentication.
	 * @param  {Object} `options.creds` Github credentials. May be a token or a username and password. If execuled [ask-for-github-auth][] will be used.
	 * @param  {Boolean} `options.stringify` When set to `false` the contributors will be objects in the `contributors` array. Defaults to `true`.
	 * @param {Function} `cb` Callback function that will get an `err` when an error happens or a `results` with the updated package.json object.
	 * @api public
	 * @name update
	 */
	
	exports['default'] = function (pkg, options, cb) {
	  if (typeof options === 'function') {
	    cb = options;
	    options = {};
	  }
	  var repo = undefined;
	  if (typeof pkg.repository === 'object') {
	    repo = (0, _parseGithubUrl2['default'])(pkg.repository.url);
	  } else {
	    repo = (0, _parseGithubUrl2['default'])(pkg.repository);
	  }
	  if (!repo) return cb(new Error('Invalid repository property.'));
	
	  _async2['default'].waterfall([
	  // ask for creds
	  function (next) {
	    if (options.creds) {
	      var creds = options.creds;
	      delete options.creds;
	      return next(null, creds);
	    }
	    (0, _askForGithubAuth2['default'])({ store: store }, next);
	  },
	
	  // update creds on options
	  function (creds, next) {
	    options = (0, _mixinDeep2['default'])({}, options, creds);
	    next();
	  },
	
	  // get contributors
	  _async2['default'].apply(_githubContributors2['default'], repo.repopath, options),
	
	  // get contributor information
	  function (contributors, next) {
	    if (!Array.isArray(contributors)) {
	      return next(new Error(contributors.message));
	    }
	    var github = new _githubBase2['default'](options);
	    pkg.contributors = [];
	    _async2['default'].eachSeries(contributors, function (contributor, nextContributor) {
	      github.get('/users/:login', contributor, function (err, user) {
	        if (err) return nextContributor(err);
	        if (user && user.message && user.message === 'Bad credentials') {
	          return nextContributor(new Error(user.message));
	        }
	        var contrib = {
	          name: user.name || user.login,
	          email: user.email || '',
	          url: user.html_url
	        };
	        if (options.stringify !== false) {
	          contrib = (0, _stringifyAuthor2['default'])(contrib);
	        }
	        pkg.contributors.push(contrib);
	        nextContributor();
	      });
	    }, next);
	  }], function (err) {
	    if (err) return cb(err);
	    cb(null, pkg);
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("async");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("mixin-deep");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("github-base");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("data-store");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("parse-github-url");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("ask-for-github-auth");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("stringify-author");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("github-contributors");

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map