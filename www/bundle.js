/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getType = function getType(param) {
    return Object.prototype.toString.call(param);
};

var checkType = function checkType(param, type) {
    return !!param && getType(param) === "[object " + type + "]";
};

var checkBoolean = function checkBoolean(param) {
    return checkType(param, "Boolean");
};
var checkNumber = function checkNumber(param) {
    return checkType(param, "Number");
};
var checkObject = function checkObject(param) {
    return checkType(param, "Object");
};
var checkArray = function checkArray(param) {
    return checkType(param, "Array");
};
var checkString = function checkString(param) {
    return checkType(param, "String");
};
var checkFunction = function checkFunction(param) {
    return checkType(param, "Function");
};
var checkNull = function checkNull(param) {
    return getType(param) === '[object Null]';
};
var checkUndefined = function checkUndefined(param) {
    return getType(param) === '[object Undefined]';
};

module.exports = {
    getType: getType,
    // checkType,
    checkBoolean: checkBoolean,
    checkNumber: checkNumber,
    checkObject: checkObject,
    checkArray: checkArray,
    checkString: checkString,
    checkFunction: checkFunction,
    checkNull: checkNull,
    checkUndefined: checkUndefined
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TableView = __webpack_require__(4);

var _TableView2 = _interopRequireDefault(_TableView);

var _Elements = __webpack_require__(2);

var DOM = _interopRequireWildcard(_Elements);

var _Table = __webpack_require__(5);

var Db = _interopRequireWildcard(_Table);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let table = TableView({ data: {} });
//document.body.appendChild(table);
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
});

// local web and sql has to be running (web_on & sql_on)
var args = {
    // 'http://' prefix is important
    url: "http://mmm-api.mmm/api", // does not work anymore, configure routes first!
    // url: "http://mmm-api.mmm/php/",
    // db: "SVG", table: "Path",
    // db: "bv2", table: "glomma_apartments",
    db: "bv2", table: "ringnespark_apartments"
    // db: "bv2", table: "skallum_apartments",
    // db: "relay", table: "people",
};

Db.loadTable(args).then(function (tableData) {
    var tableView = (0, _TableView2.default)({
        data: tableData
    });
    document.body.appendChild(tableView);

    DOM.mount(tableView);
}, function (ret) {
    console.warn(ret.error);
    document.write(ret.response);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UnorderedList = exports.OrderedLists = exports.ListItem = exports.TextArea = exports.Input = exports.Pre = exports.Img = exports.Button = exports.A = exports.P = exports.Span = exports.Group = exports.Div = exports.App = exports.mount = exports.addClasses = exports.applyStyle = exports.appendChildren = exports.getParents = exports.forParents = exports.checkCreationParams = exports.genClassId = exports.genId = undefined;

var _ParamCheck = __webpack_require__(0);

var __ = _interopRequireWildcard(_ParamCheck);

var _Events = __webpack_require__(3);

var Evt = _interopRequireWildcard(_Events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//=================================================================================

var _Element = {
    id: String,
    class: String,
    style: { "css-rule": "value" },
    type: String,
    props: Object,
    children: [] // of HTMLElement
};

var genId = exports.genId = function genId() {
    return "id" + Math.random().toString().slice(2);
};
var genClassId = exports.genClassId = function genClassId() {
    return "cls" + Math.random().toString().slice(2);
};

var checkCreationParams = exports.checkCreationParams = function checkCreationParams(args) {
    if (!__.checkObject(args)) {
        throw "SplitView: no arguments provided";
    }
    if (args.id && !__.checkString(args.id)) {
        throw "not a string";
    }
    if (args.class && !__.checkString(args.class)) {
        throw "not a string";
    }
    if (args.attr && !__.checkObject(args.attr)) {
        throw "not an object";
    }
    if (args.listeners && !__.checkObject(args.listeners)) {
        throw "not an object";
    }
    if (args.style && !__.checkObject(args.style)) {
        throw "not an object";
    }
    if (args.children && !__.checkArray(args.children)) {
        throw "not an array";
    }
    if (args.text) {
        if (!__.checkString(args.text)) {
            console.error("Div: text is not a string.");
        } else if (args.Type === "div") {
            console.warn("Div: unwrapped text. Children will get omitted.");
        }
    }
    var rest = Object.keys(args).filter(function (k) {
        return !(k == "id" || k == "class" || k == "attr" || k == "Type" || k == "text" || k == "listeners" || k == "style" || k == "children" || k == "listenTo");
    });
    if (rest.length) {
        console.warn("redundant properties in args: " + rest.join(", "));
    }
};

var forParents = exports.forParents = function forParents(elem, untilElem, cb, cbFilter) {
    var parent = elem;
    while ((parent = parent.parentElement) && parent !== untilElem) {
        if (cbFilter && !cbFilter(parent)) {
            continue;
        } else {
            cb(parent);
        }
    }
};

var getParents = exports.getParents = function getParents(elem, untilElem) {
    var parents = [];
    forParents(elem, untilElem || document.body, function (parent) {
        return parents.push(parent);
    });
    return parents;
};

var appendChildren = exports.appendChildren = function appendChildren(node, children) {
    if (false) {
        if (!(node instanceof Element)) throw Error("node is not an Element");
        if (!__.checkArray(children)) throw Error("children is not an array");
    }
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        try {
            node.appendChild(child);
        } catch (e) {
            console.error(e.message + ": " + (node.id || node.constructor.name));
        };
    }
};

var applyStyle = exports.applyStyle = function applyStyle(node, style) {
    if (false) {
        if (!(node instanceof Element)) {
            throw Error("node is not an Element");
        }
        if (!__.checkObject(style)) {
            throw Error("style is not an object");
        }
    }

    Object.keys(style).forEach(function (rule) {
        node.style[rule] = style[rule];
    });
};

var addClasses = exports.addClasses = function addClasses(elem, classStr) {
    if (false) {
        if (!(elem instanceof Element)) throw Error("Elements: elem is not an Element");
        if (!__.checkString(classStr)) throw Error("Elements: classStr is not a string");
    }

    var list = classStr.split(' ');
    list.forEach(function (_class) {
        elem.classList.add(_class);
    });
};

var setAttributes = function setAttributes(elem, attrs) {
    if (false) {
        if (!(elem instanceof Element)) throw Error("Elements: elem is not an Element");
        if (!__.checkObject(attrs)) throw Error("Elements: props is not an Object");
    }
    Object.keys(attrs).forEach(function (attr) {
        if (false) {
            if (attr === "class" && attr === 'children' && attr === 'style' && attr === 'listenTo') {
                throw Error("Elements: attrs should not contain: class|children|style|listenTo");
            }
        }

        elem[attr] = attrs[attr];
    });
};

var addListeners = function addListeners(elem, listeners) {
    if (false) {
        if (!(elem instanceof Element)) throw "Elements: noelemde is not an Element";
        if (!__.checkObject(listeners)) throw "Elements: listeners is not an Object";
    }
    Object.keys(listeners).forEach(function (key) {
        elem.addEventListener(key, listeners[key]);
    });
};

var Create = function Create(args) {
    if (false) {
        checkCreationParams(args);
    }
    var elem = document.createElement(args.Type);
    if (false) {
        if (elem instanceof HTMLUnknownElement) {
            throw "Unknown Element";
        }
    }

    if (args.id) elem.id = args.id;
    if (args.class) addClasses(elem, args.class);
    if (args.style) applyStyle(elem, args.style);
    if (args.children) appendChildren(elem, args.children);
    if (args.listenTo) addListeners(elem, args.listenTo);
    if (args.attr) setAttributes(elem, args.attr);
    if (args.text) elem.innerText = args.text;

    return elem;
};

// traverse the DOM via breadth-first and send a "mgMount" message to each element 
var mount = exports.mount = function mount() {
    var stack = [document.body];
    var stackIndex = 0;
    var elem = void 0;

    while (elem = stack[stackIndex]) {
        var children = elem.children;

        for (var i = 0; i < children.length; i++) {
            var child = children.item(i);
            stack.push(child);
        }

        stackIndex++;
    }
    // mount elements in reverse order, root at last
    stack.reverse().forEach(function (elem) {
        Evt.trigger(elem, Evt.Type.MOUNT);
        // console.log(`mount: ${elem.tagName}, ${elem.id}, ${elem.className}`);
    });

    console.log("DOM fully loaded and parsed. Elements: " + (stackIndex - 1));
};

/**
 * An App is a function of it's modules
 */
var App = exports.App = function App(elem) {
    document.body.appendChild(elem);

    // if (args.class) addClasses(elem, args.class); delete args.class;
    // if (args.style) applyStyle(elem, args.style); delete args.style;
    // if (args.children) appendChildren(elem, args.children); delete args.children;
    // if (args.listenTo) addListeners(elem, args.listenTo); delete args.listenTo;
    // copyProps(elem, args);

    document.addEventListener("DOMContentLoaded", mount, false);
};

var Div = exports.Div = function Div(args) {
    args.Type = 'div';
    return Create(args);
};
var Group = exports.Group = Div;

var Span = exports.Span = function Span(args) {
    var _args = args || {};
    _args.Type = 'span';

    return Create(_args);
};

var P = exports.P = function P(args) {
    var _args = args || {};
    _args.Type = 'p';

    return Create(_args);
};

var A = exports.A = function A(args) {
    var _args = args || {};
    _args.Type = 'a';

    return Create(_args);
};

var Button = exports.Button = function Button(args) {
    var _args = args || {};
    _args.Type = 'button';

    return Create(_args);
};

var Img = exports.Img = function Img(args) {
    var _args = args || {};
    _args.Type = 'img';

    return Create(_args);
};

var Pre = exports.Pre = function Pre(args) {
    var _args = args || {};
    _args.Type = 'pre';

    return Create(_args);
};

var Input = exports.Input = function Input(args) {
    var _args = args || {};
    _args.Type = 'input';

    return Create(_args);
};

var TextArea = exports.TextArea = function TextArea(args) {
    var _args = args || {};
    _args.Type = 'textarea';

    return Create(_args);
};

var ListItem = exports.ListItem = function ListItem(args) {
    if (!__.checkObject(args)) args = {};
    args.Type = 'li';
    return Create(args);
};

var OrderedLists = exports.OrderedLists = function OrderedLists(args) {
    if (!__.checkObject(args)) args = {};
    args.Type = 'ol';
    return Create(args);
};

var UnorderedList = exports.UnorderedList = function UnorderedList(args) {
    if (!__.checkObject(args)) args = {};

    args.Type = 'ul';
    return Create(args);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.trigger = exports.Type = undefined;

var _ParamCheck = __webpack_require__(0);

//=================================================================================
var __DEBUG__;

var EventOptions = {
    bubbles: false,
    cancelable: true
};

var Type = exports.Type = {
    MOUNT: "mgMount",
    RATIO: "mgRatio",
    RATIO_DO: "mgRatioDo",
    RESIZE: "mgResize",
    SELECT: "mgSelect",
    SELECT_DO: "mgSelectDo"
};

var trigger = exports.trigger = function trigger(elem, evtName, data, options) {
    var ev = void 0;
    if (data === undefined) {
        if ((0, _ParamCheck.checkObject)(options)) {
            ev = new Event(evtName);
        } else {
            ev = new Event(evtName, options);
        }
    } else {
        if ((0, _ParamCheck.checkObject)(options)) {
            options.detail = data;
        } else {
            options = { detail: data };
        }
        ev = new CustomEvent(evtName, options);
    }

    return elem.dispatchEvent(ev);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (args) {
    if (false) {
        var error = [];
        if (!__.checkObject(args)) {
            args = {};
            error.push("no arguments");
        } else if (!__.checkObject(args.data)) {
            error.push("no data");
        } else {
            if (!__.checkArray(args.data.columns) || !args.data.columns.length) {
                error.push("no columns");
            }
            if (!__.checkArray(args.data.rows) || !args.data.rows.length) {
                error.push("no rows");
            }
        }
        if (!!error.length) {
            args.data = data;
            console.warn("TableView: " + error.join(", ") + ", taking test data");
        }
    }

    var self = document.createElement("div");
    self.classList.add("table-wrapper");
    self.innerHTML = (0, _TableView2.default)({ data: args.data });
    self.addEventListener("mgMount", onMount, { once: true });

    return self;
};

var _ParamCheck = __webpack_require__(0);

var __ = _interopRequireWildcard(_ParamCheck);

var _TableView = __webpack_require__(8);

var _TableView2 = _interopRequireDefault(_TableView);

__webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// test data
var data = {
    columns: ["id", "name", "tree type (german)", "val 1", "val 2"],
    rows: [[0, "Heinz", "Birke", 0.12, 13], [1, "Gabi", "Eiche", 0.22, 23], [2, "Bernd", "Kiefer", 0.32, 33], [3, "Lara", "Erle", 0.42, 43]]
};

var onMount = function onMount(ev) {
    console.log("TableView mounted: " + ev.target.className);

    // flex-box initially arranged our lists, now enable manual adjustment
    // this is done by adding ".then" style to the table, which disables flex
    var rulers = document.querySelectorAll(".ruler");
    for (var i = 0; i < rulers.length; i++) {
        var ruler = rulers.item(i);
        var lb = ruler.parentElement; // a list-box

        lb.style["width"] = lb.clientWidth + "px"; // 'bake' width into list-box
    }

    // get all list items
    var lis = document.querySelectorAll('.list li');

    document.querySelector(".table").classList.add("then");

    // add drag listeners to all rulers

    var _loop = function _loop(_i) {
        var ruler = rulers.item(_i);

        ruler.addEventListener("mousedown", function (ev) {
            if (false) console.log("mouse down " + _i);

            var ruler = ev.target;
            var lb = ruler.parentElement;
            var mm = void 0,
                mmOptions = { capture: true };
            var _mu = void 0,
                muOptions = { once: true };

            // disable pointer events to prevent "flickering" while dragging
            for (var _i2 = 0; _i2 < lis.length; _i2++) {
                lis[_i2].style['pointer-events'] = 'none';
            }

            window.addEventListener("mousemove", mm = function mm(ev) {
                lb.style.width = ev.pageX - lb.offsetLeft + "px";
            }, mmOptions);

            window.addEventListener("mouseup", _mu = function mu() {
                window.removeEventListener("mousemove", mm, mmOptions);
                window.removeEventListener("mouseup", _mu, muOptions);

                // reenable pointer events
                for (var _i3 = 0; _i3 < lis.length; _i3++) {
                    lis[_i3].style['pointer-events'] = '';
                }

                if (false) console.log("mouse up " + _i);
            });
        });
    };

    for (var _i = 0; _i < rulers.length; _i++) {
        _loop(_i);
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadTable = undefined;

var _ParamCheck = __webpack_require__(0);

var __ = _interopRequireWildcard(_ParamCheck);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var file = "Table.js::";

/** Load a table from a mysql database
    @param {string} - the url of the php script that connects to mysql
    @param {string} - database name
    @param {string} - table name
    @return {Promise}
    success: the resolve function gets the JSON-parsed response (object):    
        resolve({
            columns: [], // an array of strings, the column titles
            rows: [] // an array of data matching the above column layout
        });
    failure: the reject function is called with an error description
        reject ({
            error: "error description"
        })
 */
var loadTable = function loadTable(args) {
    if (false) {
        var func = "loadTable: ";
        var error = [];
        if (!__.checkObject(args)) {
            error.push("No arguments provided.");
        } else {
            if (!__.checkString(args.url)) {
                error.push("No URL string provided.");
            }
            if (!__.checkString(args.db)) {
                error.push("No database name provided.");
            }
            if (!__.checkString(args.table)) {
                error.push("No table name provided.");
            }
        }
        if (error.length) {
            // return an immediately rejected promise
            return new Promise(function (ok, reject) {
                reject({ error: file + func + error.join(", ") });
            });
        }
    }

    var executor = function executor(resolve, reject) {

        var xhr = new XMLHttpRequest();
        var req = args.url + "/" + args.db + "/" + args.table;
        xhr.open("GET", req, true); // true means async

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var ret = {};
                if (xhr.status === 200) {
                    try {
                        ret = JSON.parse(xhr.responseText);
                    } catch (e) {
                        ret.error = e.message;
                        ret.response = xhr.responseText;
                    }
                    if (ret.error) {
                        reject(ret);
                    } else {
                        resolve(ret);
                    }
                } else {
                    ret.error = "There was a network error.";
                    reject(ret);
                }
            }
        };
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    };

    return new Promise(executor);
};

/*
     CREATE TABLE `Circle` (
     `id` int(32) UNSIGNED NOT NULL,
     `group_id` int(12) UNSIGNED DEFAULT NULL,
     `d` text NOT NULL,
     `style` varchar(1024) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 */
var createTable = function createTable(name) {};

var getInfo = function getInfo(url) {
    var xhr = new XMLHttpRequest();
    var req = "http://mmm-api.mmm/api/info.php";
    xhr.open("GET", req, true); // true means async

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {}
        }
    };
};

exports.loadTable = loadTable;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, ".table {\n  display: flex;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  cursor: default;\n  white-space: nowrap;\n}\n.table.then {\n  display: block;\n}\n.table.then .list-box {\n  flex: unset;\n  display: inline-block;\n  vertical-align: top;\n  width: initial;\n}\n.list-box {\n  flex: 1;\n  position: relative;\n  min-width: 100px;\n  border: 1px solid #aaa;\n}\n.list-box .list {\n  list-style-type: none;\n  padding: 0;\n  margin: 0;\n  text-align: center;\n}\n.list-box .list li {\n  padding: 2px;\n}\n.list-box .list li:first-child {\n  border-bottom: 2px solid #aaa;\n  background-color: #eee;\n}\n.list-box .list li:first-child:hover {\n  background-color: #ffd;\n}\n.list-box .list li:hover {\n  background-color: #dff;\n}\n.list-box .list li .cell {\n  height: 20px;\n  overflow: hidden;\n}\n.list-box .ruler {\n  position: absolute;\n  width: 8px;\n  right: -5px;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  background-color: #f6f6f6;\n  opacity: 0;\n}\n.list-box .ruler:hover {\n  cursor: ew-resize;\n}\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(9);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (data) {pug_mixins["cell"] = pug_interp = function(content){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cli\u003E\u003Cdiv class=\"cell\"\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = content) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fli\u003E";
};
pug_mixins["list"] = pug_interp = function(title, rows, col){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cul class=\"list\"\u003E";
pug_mixins["cell"](title);
// iterate rows
;(function(){
  var $$obj = rows;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var row = $$obj[pug_index0];
pug_mixins["cell"](row[col]);
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var row = $$obj[pug_index0];
pug_mixins["cell"](row[col]);
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E";
};
pug_mixins["table"] = pug_interp = function(data){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"table\"\u003E";
// iterate data.columns
;(function(){
  var $$obj = data.columns;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var col = $$obj[i];
pug_html = pug_html + "\u003Cdiv class=\"list-box\"\u003E";
pug_mixins["list"](col, data.rows, i);
pug_html = pug_html + "\u003Cdiv class=\"ruler\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var col = $$obj[i];
pug_html = pug_html + "\u003Cdiv class=\"list-box\"\u003E";
pug_mixins["list"](col, data.rows, i);
pug_html = pug_html + "\u003Cdiv class=\"ruler\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
pug_mixins["table"](data);}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return pug_html;};
module.exports = template;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pug_has_own_property = Object.prototype.hasOwnProperty;

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = pug_merge;
function pug_merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = pug_merge(attrs, a[i]);
    }
    return attrs;
  }

  for (var key in b) {
    if (key === 'class') {
      var valA = a[key] || [];
      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
    } else if (key === 'style') {
      var valA = pug_style(a[key]);
      var valB = pug_style(b[key]);
      a[key] = valA + valB;
    } else {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Process array, object, or string as a string of classes delimited by a space.
 *
 * If `val` is an array, all members of it and its subarrays are counted as
 * classes. If `escaping` is an array, then whether or not the item in `val` is
 * escaped depends on the corresponding item in `escaping`. If `escaping` is
 * not an array, no escaping is done.
 *
 * If `val` is an object, all the keys whose value is truthy are counted as
 * classes. No escaping is done.
 *
 * If `val` is a string, it is counted as a class. No escaping is done.
 *
 * @param {(Array.<string>|Object.<string, boolean>|string)} val
 * @param {?Array.<string>} escaping
 * @return {String}
 */
exports.classes = pug_classes;
function pug_classes_array(val, escaping) {
  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = pug_classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = pug_escape(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}
function pug_classes_object(val) {
  var classString = '', padding = '';
  for (var key in val) {
    if (key && val[key] && pug_has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}
function pug_classes(val, escaping) {
  if (Array.isArray(val)) {
    return pug_classes_array(val, escaping);
  } else if (val && typeof val === 'object') {
    return pug_classes_object(val);
  } else {
    return val || '';
  }
}

/**
 * Convert object or string to a string of CSS styles delimited by a semicolon.
 *
 * @param {(Object.<string, string>|string)} val
 * @return {String}
 */

exports.style = pug_style;
function pug_style(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    var out = '';
    for (var style in val) {
      /* istanbul ignore else */
      if (pug_has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    val += '';
    if (val[val.length - 1] !== ';') 
      return val + ';';
    return val;
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = pug_attr;
function pug_attr(key, val, escaped, terse) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }
  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }
  if (typeof val.toJSON === 'function') {
    val = val.toJSON();
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }
  if (escaped) val = pug_escape(val);
  return ' ' + key + '="' + val + '"';
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} terse whether to use HTML5 terse boolean attributes
 * @return {String}
 */
exports.attrs = pug_attrs;
function pug_attrs(obj, terse){
  var attrs = '';

  for (var key in obj) {
    if (pug_has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = pug_classes(val);
        attrs = pug_attr(key, val, false, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = pug_style(val);
      }
      attrs += pug_attr(key, val, false, terse);
    }
  }

  return attrs;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var pug_match_html = /["&<>]/;
exports.escape = pug_escape;
function pug_escape(_html){
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the pug in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @param {String} str original source
 * @api private
 */

exports.rethrow = pug_rethrow;
function pug_rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || __webpack_require__(13).readFileSync(filename, 'utf8')
  } catch (ex) {
    pug_rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Pug') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(11)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/less-loader/dist/index.js??ref--1-2!./TableView.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/less-loader/dist/index.js??ref--1-2!./TableView.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map