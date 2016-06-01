(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/forOwn"), require("when"), require("when/sequence"), require("lodash/map"), require("lodash/curry"), require("lodash/mapValues"), require("lodash/property"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/forOwn", "when", "when/sequence", "lodash/map", "lodash/curry", "lodash/mapValues", "lodash/property"], factory);
	else if(typeof exports === 'object')
		exports["theTestingFramework"] = factory(require("lodash/forOwn"), require("when"), require("when/sequence"), require("lodash/map"), require("lodash/curry"), require("lodash/mapValues"), require("lodash/property"));
	else
		root["theTestingFramework"] = factory(root["lodash/forOwn"], root["when"], root["when/sequence"], root["lodash/map"], root["lodash/curry"], root["lodash/mapValues"], root["lodash/property"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_17__, __WEBPACK_EXTERNAL_MODULE_18__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.integrate = exports.countTests = exports.descriptorToExecutableTree = exports.runExecutableTree = exports.bddApi = undefined;
	
	var _bddApi = __webpack_require__(2);
	
	var bddApi = _interopRequireWildcard(_bddApi);
	
	var _runExecutableTree = __webpack_require__(5);
	
	var _runExecutableTree2 = _interopRequireDefault(_runExecutableTree);
	
	var _descriptorToExecutableTree = __webpack_require__(16);
	
	var _descriptorToExecutableTree2 = _interopRequireDefault(_descriptorToExecutableTree);
	
	var _countTests = __webpack_require__(19);
	
	var _countTests2 = _interopRequireDefault(_countTests);
	
	var _index = __webpack_require__(20);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.bddApi = bddApi;
	exports.runExecutableTree = _runExecutableTree2.default;
	exports.descriptorToExecutableTree = _descriptorToExecutableTree2.default;
	exports.countTests = _countTests2.default;
	exports.integrate = _index2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.capture = capture;
	exports.createSuite = createSuite;
	exports.createSpec = createSpec;
	exports.beforeEach = beforeEach;
	exports.afterEach = afterEach;
	exports.beforeAll = beforeAll;
	exports.afterAll = afterAll;
	exports.it = it;
	exports.describe = describe;
	
	var _SuiteDescriptor = __webpack_require__(3);
	
	var _SuiteDescriptor2 = _interopRequireDefault(_SuiteDescriptor);
	
	var _SpecDescriptor = __webpack_require__(4);
	
	var _SpecDescriptor2 = _interopRequireDefault(_SpecDescriptor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var stackOfSuiteDescriptors = [];
	var getTopSuite = function getTopSuite() {
	    return stackOfSuiteDescriptors[stackOfSuiteDescriptors.length - 1];
	};
	
	function startCapturingSuite(opts) {
	    var suiteDescriptor = new _SuiteDescriptor2.default(opts);
	
	    var timeoutForCheckingIfWeHaveStopped = setTimeout(function () {
	        console.error('Suite \'' + suiteDescriptor.name + '\' is still capturing.');
	    }, 0);
	
	    stackOfSuiteDescriptors.push(suiteDescriptor);
	
	    var stopAndReturnDescriptor = function stopAndReturnDescriptor() {
	        if (typeof timeoutForCheckingIfWeHaveStopped === 'undefined') {
	            throw new Error('Already stopped capturing suite \'' + suiteDescriptor.name + '\'');
	        } else {
	            clearTimeout(timeoutForCheckingIfWeHaveStopped);
	            timeoutForCheckingIfWeHaveStopped = void 0;
	        }
	
	        stackOfSuiteDescriptors.pop();
	        return suiteDescriptor;
	    };
	
	    return { stopAndReturnDescriptor: stopAndReturnDescriptor };
	}
	
	function capture() {
	    var _startCapturingSuite = startCapturingSuite({ name: '$$$root' });
	
	    var stopAndReturnDescriptor = _startCapturingSuite.stopAndReturnDescriptor;
	
	
	    return { stopAndReturnDescriptor: stopAndReturnDescriptor };
	}
	
	function createSuite(partialDescription, cb) {
	    var _startCapturingSuite2 = startCapturingSuite(partialDescription);
	
	    var stopAndReturnDescriptor = _startCapturingSuite2.stopAndReturnDescriptor;
	
	    var defaultTimeoutDuration = void 0;
	    var context = {
	        timeout: function timeout(dur) {
	            defaultTimeoutDuration = dur;
	        }
	    };
	    cb.call(context);
	    var suiteDescriptor = stopAndReturnDescriptor();
	    if (defaultTimeoutDuration) {
	        suiteDescriptor.defaultTimeoutDuration = defaultTimeoutDuration;
	    }
	    getTopSuite().addSubSuite(suiteDescriptor);
	}
	
	function createSpec(config, fn) {
	    var spec = new _SpecDescriptor2.default(_extends({}, config, { fn: fn }));
	    getTopSuite().addSpec(spec);
	}
	
	function beforeEach(fn) {
	    getTopSuite().addHook('beforeEach', fn);
	}
	
	function afterEach(fn) {
	    getTopSuite().addHook('afterEach', fn);
	}
	
	function beforeAll(fn) {
	    getTopSuite().addHook('beforeAll', fn);
	}
	
	function afterAll(fn) {
	    getTopSuite().addHook('afterAll', fn);
	}
	
	function it(name, fn) {
	    if (typeof fn !== 'function') {
	        it.skip(name, fn);
	    } else {
	        createSpec({ name: name }, fn);
	    }
	}
	
	it.skip = function (name, fn) {
	    createSpec({ name: name, isSkipped: true }, fn);
	};
	
	it.only = function (name, fn) {
	    createSpec({ name: name, isExclusive: true }, fn);
	};
	
	it.parallel = function (name, fn) {
	    if (typeof fn !== 'function') {
	        it.parallel.skip(name, fn);
	    } else {
	        createSpec({ name: name, isParallel: true }, fn);
	    }
	};
	
	it.parallel.skip = function (name, fn) {
	    createSpec({ name: name, isParallel: true, isSkipped: true }, fn);
	};
	
	it.parallel.only = function (name, fn) {
	    createSpec({ name: name, isParallel: true, isExclusive: true }, fn);
	};
	
	function describe(name, fn) {
	    createSuite({ name: name }, fn);
	}
	
	describe.only = function (name, fn) {
	    createSuite({ name: name, isExclusive: true }, fn);
	};
	
	describe.skip = function (name, fn) {
	    createSuite({ name: name, isSkipped: true }, fn);
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _SpecDescriptor = __webpack_require__(4);
	
	var _SpecDescriptor2 = _interopRequireDefault(_SpecDescriptor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SuiteDescriptor = function () {
	    function SuiteDescriptor(_ref) {
	        var name = _ref.name;
	        var isSkipped = _ref.isSkipped;
	        var isExclusive = _ref.isExclusive;
	
	        _classCallCheck(this, SuiteDescriptor);
	
	        this._name = name;
	        this._isSkipped = !!isSkipped;
	        this._isExclusive = !!isExclusive;
	        this._subSuites = {};
	        this._specs = {};
	        this._hooks = {
	            beforeEach: [],
	            afterEach: [],
	            beforeAll: [],
	            afterAll: []
	        };
	        this._defaultTimeoutDuration = null;
	    }
	
	    _createClass(SuiteDescriptor, [{
	        key: 'addSubSuite',
	        value: function addSubSuite(suite) {
	            if (!(suite instanceof SuiteDescriptor)) {
	                throw Error('subSuite must be an instance of SuiteDescriptor');
	            }
	
	            if (this._subSuites[suite.name]) {
	                throw new Error('Suite \'' + this.name + '\' already has a sub-suite named \'' + suite.name + '\'');
	            }
	
	            this._subSuites[suite.name] = suite;
	            return this;
	        }
	    }, {
	        key: 'addSpec',
	        value: function addSpec(spec) {
	            if (!(spec instanceof _SpecDescriptor2.default)) {
	                throw Error('spec must be an instance of SpecDescriptor');
	            }
	
	            if (this._specs[spec.name]) {
	                throw new Error('Suite \'' + this.name + '\' already has a spec named \'' + spec.name + '\'');
	            }
	
	            this._specs[spec.name] = spec;
	            return this;
	        }
	    }, {
	        key: 'addHook',
	        value: function addHook(placement, hook) {
	            if (!this._hooks[placement]) {
	                throw new Error('Unkown hook placement \'' + placement + '\'');
	            }
	
	            this._hooks[placement].push(hook);
	            return this;
	        }
	    }, {
	        key: 'defaultTimeoutDuration',
	        get: function get() {
	            return this._defaultTimeoutDuration;
	        },
	        set: function set(newDur) {
	            this._defaultTimeoutDuration = newDur;
	        }
	    }, {
	        key: 'name',
	        get: function get() {
	            return this._name;
	        }
	    }, {
	        key: 'specs',
	        get: function get() {
	            return _extends({}, this._specs);
	        }
	    }, {
	        key: 'subSuites',
	        get: function get() {
	            return _extends({}, this._subSuites);
	        }
	    }, {
	        key: 'beforeEachHooks',
	        get: function get() {
	            return [].concat(_toConsumableArray(this._hooks.beforeEach));
	        }
	    }, {
	        key: 'afterEachHooks',
	        get: function get() {
	            return [].concat(_toConsumableArray(this._hooks.afterEach));
	        }
	    }, {
	        key: 'beforeAllHooks',
	        get: function get() {
	            return [].concat(_toConsumableArray(this._hooks.beforeAll));
	        }
	    }, {
	        key: 'afterAllHooks',
	        get: function get() {
	            return [].concat(_toConsumableArray(this._hooks.afterAll));
	        }
	    }, {
	        key: 'isSkipped',
	        get: function get() {
	            return this._isSkipped;
	        }
	    }, {
	        key: 'isExclusive',
	        get: function get() {
	            return this._isExclusive;
	        }
	    }]);
	
	    return SuiteDescriptor;
	}();
	
	exports.default = SuiteDescriptor;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SpecDescriptor = function () {
	    function SpecDescriptor(_ref) {
	        var name = _ref.name;
	        var fn = _ref.fn;
	        var isParallel = _ref.isParallel;
	        var isSkipped = _ref.isSkipped;
	        var isExclusive = _ref.isExclusive;
	
	        _classCallCheck(this, SpecDescriptor);
	
	        this._name = name;
	        this._fn = fn;
	        this._isParallel = !!isParallel;
	        this._isSkipped = !!isSkipped;
	        this._isExclusive = !!isExclusive;
	    }
	
	    _createClass(SpecDescriptor, [{
	        key: "name",
	        get: function get() {
	            return this._name;
	        }
	    }, {
	        key: "fn",
	        get: function get() {
	            return this._fn;
	        }
	    }, {
	        key: "isParallel",
	        get: function get() {
	            return this._isParallel;
	        }
	    }, {
	        key: "isSkipped",
	        get: function get() {
	            return this._isSkipped;
	        }
	    }, {
	        key: "isExclusive",
	        get: function get() {
	            return this._isExclusive;
	        }
	    }]);
	
	    return SpecDescriptor;
	}();
	
	exports.default = SpecDescriptor;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = runExecutableTree;
	
	var _traverseExecutableTree = __webpack_require__(6);
	
	var _traverseExecutableTree2 = _interopRequireDefault(_traverseExecutableTree);
	
	var _determineExclusivenessOfExecutableTree = __webpack_require__(8);
	
	var _determineExclusivenessOfExecutableTree2 = _interopRequireDefault(_determineExclusivenessOfExecutableTree);
	
	var _SequentialQueue = __webpack_require__(9);
	
	var _SequentialQueue2 = _interopRequireDefault(_SequentialQueue);
	
	var _ParallelQueue = __webpack_require__(11);
	
	var _ParallelQueue2 = _interopRequireDefault(_ParallelQueue);
	
	var _runSpecFunction = __webpack_require__(12);
	
	var _runSpecFunction2 = _interopRequireDefault(_runSpecFunction);
	
	var _when = __webpack_require__(10);
	
	var _when2 = _interopRequireDefault(_when);
	
	var _sequence = __webpack_require__(13);
	
	var _sequence2 = _interopRequireDefault(_sequence);
	
	var _map = __webpack_require__(14);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _curry = __webpack_require__(15);
	
	var _curry2 = _interopRequireDefault(_curry);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function runExecutableTree(tree, log) {
	    var rootHasExclusiveTests = (0, _determineExclusivenessOfExecutableTree2.default)(tree);
	    var sequentialQueue = new _SequentialQueue2.default();
	    var parallelQueue = new _ParallelQueue2.default();
	
	    var context = {
	        rootHasExclusiveTests: rootHasExclusiveTests,
	        log: log,
	        sequentialQueue: sequentialQueue,
	        pushTaskToSequentialQueue: sequentialQueue.push.bind(sequentialQueue),
	        parallelQueue: parallelQueue,
	        pushTaskToParallelQueue: parallelQueue.push.bind(parallelQueue)
	    };
	
	    return runSuite(context, tree);
	}
	
	function addressToString(address) {
	    return address.join(' ');
	}
	
	function runSuite(context, suite) {
	    var hookToPromise = function hookToPromise(_ref) {
	        var fn = _ref.fn;
	        var address = _ref.address;
	        return context.pushTaskToSequentialQueue(fn).catch(function (reason) {
	            context.log('fail', { address: address, error: reason });
	            throw new Error('Error running ' + addressToString(address));
	        });
	    };
	
	    var donePromise = (0, _when2.default)().then(function () {
	        return _when2.default.all(suite.beforeAllHooks.map(hookToPromise));
	    }).then(function () {
	        var specsPromise = _when2.default.all((0, _map2.default)(suite.specs, function (spec) {
	            return runSpec(context, spec);
	        }));
	
	        var subSuitesPromise = _when2.default.all((0, _map2.default)(suite.subSuites, function (subSuite) {
	            return runSuite(context, subSuite);
	        }));
	
	        return _when2.default.all([specsPromise, subSuitesPromise]);
	    }, function () {}).then(function () {
	        return _when2.default.all(suite.afterAllHooks.map(hookToPromise)).catch(function () {});
	    });
	
	    return donePromise;
	}
	
	function runSpec(context, spec) {
	    var shouldSkip = spec.isSkipped || context.rootHasExclusiveTests && !context.isExclusive;
	
	    if (shouldSkip) {
	        context.log('skip', { address: spec.address });
	        return _when2.default.Promise.resolve();
	    }
	
	    var hookToTask = function hookToTask(_ref2) {
	        var fn = _ref2.fn;
	        var address = _ref2.address;
	        return function () {
	            return _when2.default.try(fn).catch(function (reason) {
	                context.log('fail', { address: address, error: reason });
	                throw new Error('Error running ' + addressToString(address));
	            });
	        };
	    };
	
	    var theTask = function theTask() {
	        return (0, _when2.default)().then(function () {
	            return (0, _sequence2.default)(spec.beforeEachHooks.map(hookToTask));
	        }).then(function () {
	            return (0, _runSpecFunction2.default)(spec.fn, spec.defaultTimeoutDuration).then(function () {
	                context.log('success', { address: spec.address });
	            }, function (reason) {
	                context.log('fail', { address: spec.address, error: reason });
	            });
	        }).catch(function () {}).then(function () {
	            return (0, _sequence2.default)(spec.afterEachHooks.map(hookToTask)).catch(function () {});
	        });
	    };
	
	    if (spec.isParallel) {
	        return context.pushTaskToParallelQueue(theTask);
	    } else {
	        return context.pushTaskToSequentialQueue(theTask);
	    }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = traverseExecutableTree;
	
	var _forOwn = __webpack_require__(7);
	
	var _forOwn2 = _interopRequireDefault(_forOwn);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function traverseExecutableTree(tree, iteratee) {
	    return traverseSuite(tree, iteratee);
	}
	
	function traverseSuite(suite, iteratee, parent) {
	    if (iteratee('suite', suite, parent) === false) {
	        return false;
	    }
	
	    var shouldExit = false;
	    (0, _forOwn2.default)(suite.specs, function (spec) {
	        if (iteratee('spec', spec, suite) === false) {
	            shouldExit = true;
	            return false;
	        }
	    });
	
	    if (shouldExit) {
	        return false;
	    }
	
	    (0, _forOwn2.default)(suite.subSuites, function (subSuite) {
	        if (traverseSuite(subSuite, iteratee, suite) === false) {
	            shouldExit = true;
	            return false;
	        }
	    });
	
	    if (shouldExit) {
	        return false;
	    }
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = determineExclusiveneessOfExecutableTree;
	
	var _traverseExecutableTree = __webpack_require__(6);
	
	var _traverseExecutableTree2 = _interopRequireDefault(_traverseExecutableTree);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function determineExclusiveneessOfExecutableTree(tree) {
	    var isExclusive = false;
	    (0, _traverseExecutableTree2.default)(tree, function (type, node) {
	        if (node.isExclusive === true) {
	            isExclusive = true;
	            return false;
	        }
	    });
	
	    return isExclusive;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _when = __webpack_require__(10);
	
	var _when2 = _interopRequireDefault(_when);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function noop() {};
	
	var SequentialQueue = function () {
	    function SequentialQueue() {
	        _classCallCheck(this, SequentialQueue);
	
	        this._queue = [];
	        this._isIterating = false;
	    }
	
	    _createClass(SequentialQueue, [{
	        key: 'push',
	        value: function push(fn) {
	            var deferred = _when2.default.defer();
	
	            this._queue.push(function () {
	                var functionPromise = _when2.default.try(fn);
	
	                functionPromise.done(function () {
	                    deferred.resolve();
	                }, function (reason) {
	                    deferred.reject(reason);
	                });
	
	                return functionPromise.then(noop, noop);
	            });
	
	            this._drain();
	
	            return deferred.promise;
	        }
	    }, {
	        key: '_drain',
	        value: function _drain() {
	            var _this = this;
	
	            if (this._isIterating || this._queue.length === 0) {
	                return;
	            }
	
	            this._isIterating = true;
	
	            var top = this._queue.shift();
	
	            top().done(function () {
	                _this._isIterating = false;
	                _this._drain();
	            });
	        }
	    }]);
	
	    return SequentialQueue;
	}();
	
	exports.default = SequentialQueue;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _when = __webpack_require__(10);
	
	var _when2 = _interopRequireDefault(_when);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function noop() {};
	
	var PrallelQueue = function () {
	    function PrallelQueue() {
	        var maxConcurrentTasks = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];
	
	        _classCallCheck(this, PrallelQueue);
	
	        this._maxConcurrentTasks = parseInt(maxConcurrentTasks);
	        this._queue = [];
	        this._numberOfCurrentlyRunningTasks = 0;
	    }
	
	    _createClass(PrallelQueue, [{
	        key: 'push',
	        value: function push(fn) {
	            var deferred = _when2.default.defer();
	
	            this._queue.push(function () {
	                var functionPromise = _when2.default.try(fn);
	
	                functionPromise.done(function () {
	                    deferred.resolve();
	                }, function (reason) {
	                    deferred.reject(reason);
	                });
	
	                return functionPromise.then(noop, noop);
	            });
	
	            this._drain();
	
	            return deferred.promise;
	        }
	    }, {
	        key: '_drain',
	        value: function _drain() {
	            var _this = this;
	
	            if (this._queue.length === 0 || this._numberOfCurrentlyRunningTasks === this._maxConcurrentTasks) {
	                return;
	            }
	
	            this._numberOfCurrentlyRunningTasks++;
	
	            var top = this._queue.shift();
	
	            top().done(function () {
	                _this._numberOfCurrentlyRunningTasks--;
	                _this._drain();
	            });
	        }
	    }]);
	
	    return PrallelQueue;
	}();
	
	exports.default = PrallelQueue;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = runSpecFunction;
	
	var _when = __webpack_require__(10);
	
	var _when2 = _interopRequireDefault(_when);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// function createDefaultTimeout(dur = 500) {
	//     const rejectingPromise =
	
	//     rejectingPromise.catch(() => {}); // we don't need this rejection to show up in the list of unhandled rejections
	//     return rejectingPromise;
	// }
	
	function runSpecFunction(fn) {
	    var defaultTimeoutDuration = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
	
	    if (typeof fn !== 'function') {
	        throw Error("Function expected");
	    }
	
	    var deferred = _when2.default.defer();
	    var returnValue = void 0;
	    var threw = false;
	    var theException = void 0;
	
	    var timeoutDuration = defaultTimeoutDuration;
	    var context = {
	        timeout: function timeout(dur) {
	            timeoutDuration = dur;
	        }
	    };
	
	    try {
	        returnValue = fn.apply(context);
	    } catch (e) {
	        threw = true;
	        theException = e;
	    }
	
	    if (threw) {
	        deferred.reject(theException);
	    } else if (returnValue && typeof returnValue.then === 'function') {
	        var fnPromise = returnValue;
	        _when2.default.race([fnPromise, new _when2.default.Promise(function (_, reject) {
	            setTimeout(function () {
	                reject(new Error('Expected function to run for ' + timeoutDuration + ' milliseconds.'));
	            }, timeoutDuration);
	        })]).then(function () {
	            deferred.resolve();
	        }, deferred.reject);
	    } else {
	        deferred.resolve();
	    }
	
	    return deferred.promise;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = descriptorToExecutableTree;
	
	var _mapValues = __webpack_require__(17);
	
	var _mapValues2 = _interopRequireDefault(_mapValues);
	
	var _property = __webpack_require__(18);
	
	var _property2 = _interopRequireDefault(_property);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var emptyContext = {
	    isSkipped: false, isExclusive: false, defaultTimeoutDuration: null,
	    beforeEachHooks: [], afterEachHooks: [],
	    address: []
	};
	
	function descriptorToExecutableTree(rootSuite, defaultTimeoutDuration) {
	    return suiteToExecTree(rootSuite, _extends({}, emptyContext, { isSkipped: false, isExclusive: false, defaultTimeoutDuration: defaultTimeoutDuration }));
	}
	
	function suiteToExecTree(descriptor, context) {
	    var isSkipped = descriptor.isSkipped || context.isSkipped;
	    var defaultTimeoutDuration = descriptor.defaultTimeoutDuration || context.defaultTimeoutDuration;
	    var address = [].concat(_toConsumableArray(context.address), [descriptor.name]);
	
	    var newContext = {
	        defaultTimeoutDuration: defaultTimeoutDuration,
	        isSkipped: isSkipped,
	        address: address,
	        isExclusive: !isSkipped && (descriptor.isExclusive || context.isExclusive),
	        beforeEachHooks: [].concat(_toConsumableArray(context.beforeEachHooks), _toConsumableArray(descriptor.beforeEachHooks.map(function (fn, i) {
	            return {
	                address: [].concat(_toConsumableArray(address), ['beforeEachHook#' + i]),
	                fn: fn
	            };
	        }))),
	        afterEachHooks: [].concat(_toConsumableArray(context.afterEachHooks), _toConsumableArray(descriptor.afterEachHooks.map(function (fn, i) {
	            return {
	                address: [].concat(_toConsumableArray(address), ['afterEachHook#' + i]),
	                fn: fn
	            };
	        })))
	    };
	
	    return _extends({
	        type: 'suite',
	        name: descriptor.name
	    }, newContext, {
	        specs: (0, _mapValues2.default)(descriptor.specs, function (specDescriptor) {
	            return specToExecTree(specDescriptor, newContext);
	        }),
	        subSuites: (0, _mapValues2.default)(descriptor.subSuites, function (subSuiteDescriptor) {
	            return suiteToExecTree(subSuiteDescriptor, newContext);
	        }),
	        beforeAllHooks: descriptor.beforeAllHooks.map(function (fn, i) {
	            return {
	                address: [].concat(_toConsumableArray(newContext.address), ['beforeAllHook#' + i]),
	                fn: fn
	            };
	        }),
	        afterAllHooks: descriptor.afterAllHooks.map(function (fn, i) {
	            return {
	                address: [].concat(_toConsumableArray(newContext.address), ['afterAllHook#' + i]),
	                fn: fn
	            };
	        })
	    });
	}
	
	function specToExecTree(specDescriptor, context) {
	    var isSkipped = specDescriptor.isSkipped || context.isSkipped;
	    return {
	        type: 'spec',
	        name: specDescriptor.name,
	        fn: specDescriptor.fn,
	        address: [].concat(_toConsumableArray(context.address), [specDescriptor.name]),
	        isSkipped: isSkipped,
	        isExclusive: !isSkipped && (context.isExclusive || specDescriptor.isExclusive),
	        defaultTimeoutDuration: context.defaultTimeoutDuration,
	        beforeEachHooks: context.beforeEachHooks,
	        afterEachHooks: context.afterEachHooks,
	        isParallel: specDescriptor.isParallel
	    };
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_17__;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_18__;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = countTests;
	
	var _traverseExecutableTree = __webpack_require__(6);
	
	var _traverseExecutableTree2 = _interopRequireDefault(_traverseExecutableTree);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function countTests(tree) {
	    var count = 0;
	    (0, _traverseExecutableTree2.default)(tree, function (type, node) {
	        if (type === 'spec') {
	            count++;
	        }
	    });
	
	    return count;
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _withKarma = __webpack_require__(21);
	
	var _withKarma2 = _interopRequireDefault(_withKarma);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { withKarma: _withKarma2.default };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = integrateWithKarma;
	
	var _index = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_index);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function integrateWithKarma(cb) {
	    var _t$bddApi$capture = t.bddApi.capture();
	
	    var stopAndReturnDescriptor = _t$bddApi$capture.stopAndReturnDescriptor;
	
	
	    function stop() {
	        var descriptor = stopAndReturnDescriptor();
	        var tree = t.descriptorToExecutableTree(descriptor, 500);
	
	        return { descriptor: descriptor, tree: tree };
	    }
	
	    cb();
	
	    window.__karma__.start = function () {
	        var _this = this;
	
	        var _stop = stop();
	
	        var tree = _stop.tree;
	
	        var log = function log(type, detes) {
	            switch (type) {
	                case 'success':
	                case 'skip':
	                    _this.result(_extends({}, detesToResult(detes), {
	                        success: true,
	                        skipped: type !== 'success',
	                        log: []
	                    }));
	                    break;
	                case 'fail':
	                    _this.result(_extends({}, detesToResult(detes), {
	                        success: false,
	                        skipped: false,
	                        log: [detes.error].map(formatError)
	                    }));
	                    break;
	                default:
	                    console.error('Invalid log call', type, detes);
	            }
	        };
	
	        this.info({ total: t.countTests(tree) });
	
	        t.runExecutableTree(tree, log).then(function () {
	            _this.complete();
	        });
	    };
	}
	
	function detesToResult(detes) {
	    return {
	        id: detes.address.join('/'),
	        description: detes.address[detes.address.length - 1],
	        suite: detes.address.slice(1, detes.address.length - 1)
	    };
	}
	
	function formatError(error) {
	    if (typeof error === 'string') {
	        return error;
	    }
	
	    var stack = error.stack;
	    var message = error.message;
	
	
	    if (stack) {
	        if (message && stack.indexOf(message) === -1) {
	            stack = message + '\n' + stack;
	        }
	
	        // remove mocha stack entries
	        return stack.replace(/\n.+\/the\-testing\-framework\/.+(?=(\n|$))/g, '');
	    }
	
	    return message;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map