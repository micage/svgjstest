"use strict";
const __ = require("../Util/ParamCheck");

/** A recursively called function that traverses the hierarchy of a javascript object
 * @param {Object} obj - the object to traverse
 * @param {TreeVisitor} cb - a callback function that is called for each currently visited node
 * @param {Object} nodeInfo - a structure that provides the callback with info about the currently visited node
 * @param {string} nodeInfo.id - name of the node
 * @param {boolean} nodeInfo.doContinue - inside the callback set to false stops further traversal
 * @param {boolean} nodeInfo.hasChildren - the visited node has child nodes
 * @param {number} nodeInfo.numChildren - integer, number of child nodes
 * @param {boolean} nodeInfo.isLastChild - the visited node is the last child in the parent nodes child list
 * @param {number} nodeInfo.depth - integer that equals the recursion depth
 */

let bbb = { dc: true };

/**
 * TODO: this is really ugly ... but works
 * Do not forget to reset bbb.dc!!!
 */
const _preOrder = function (obj, cb, nodeInfo) {
    if (!obj || typeof obj !== "object") return;

    let keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        if (bbb.dc === false) break;

        let key = keys[i];
        var child = obj[key];
        nodeInfo.id = key;

        if (child === null || child === undefined) {
            nodeInfo.numChildren = 0;
        }
        else if (Array.isArray(child)) {
            nodeInfo.id = `${key}[${child.length}]`;
            nodeInfo.numChildren = child.length;
        }
        else if (child && typeof child === "object") {
            nodeInfo.numChildren = Object.keys(child).length;
            nodeInfo.hasChildren = !!nodeInfo.numChildren;
        }
        else {
            nodeInfo.numChildren = 0;
        }

        nodeInfo.hasChildren = !!nodeInfo.numChildren;
        nodeInfo.data = child;
        nodeInfo.isLastChild = i === keys.length - 1;
        nodeInfo.depth++;

        bbb.dc = cb(nodeInfo); // call visitor function
        if (bbb.dc !== false) {
            _preOrder(child, cb, nodeInfo); // -> recursion
            if (bbb.dc !== false) nodeInfo.depth--;
        }
    }
}

const _preOrder_ = function (obj, cb, nodeInfo) {
    if (!obj || typeof obj !== "object") return;

    let ret = cb(nodeInfo);

    let keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        let key = keys[i];
        var child = obj[key];
        nodeInfo.id = key;

        if (child === null || child === undefined) {
            nodeInfo.numChildren = 0;
        }
        else if (Array.isArray(child)) {
            nodeInfo.id = `${key}[${child.length}]`;
            nodeInfo.numChildren = child.length;
        }
        else if (child && typeof child === "object") {
            nodeInfo.numChildren = Object.keys(child).length;
            nodeInfo.hasChildren = !!nodeInfo.numChildren;
        }
        else {
            nodeInfo.numChildren = 0;
        }

        nodeInfo.hasChildren = !!nodeInfo.numChildren;
        nodeInfo.data = child;
        nodeInfo.isLastChild = i === keys.length - 1;
        nodeInfo.depth++;

        if (_preOrder(child, cb, nodeInfo) === false) {
            return;
        }

        nodeInfo.depth--;
    }

    return ret;
}

/**
 * @constructor
 * @param {String} key
 * @param {any} value
 */
const ObjectTree = function(key, value) {
    if(__DEBUG__) {
        if (!__.checkString(key)) {
            console.error(" ObjectTree(key, obj) - key is not a string: " + key);
        }
    }

    this._key = key;
    this._value = value;
};

Object.defineProperties(ObjectTree.prototype, {
    "key": {
        get: function() { 
            return this._key;
        }
    },
    "value": {
        get: function () {
            return this._value;
        }
    }
});

/**
 * Tries to find a child node
 * Possibly the node does not exist. In that case it will NOT be created.
 */
ObjectTree.prototype.getChild = function(key) {
    let val = this._value[key];
    if (val) {
        return new ObjectTree(key, val);
    }
    else {
        return null;
    }
};

/**
 * @param {String} key
 * @param {any} value
 */
ObjectTree.prototype.setChild = function (key, value) {
    this._value[key] = value;
};

/**
 * @private
 */
function _getByFullPath(obj, fullPath)  {
    if (__DEBUG__) if (!__.checkString(fullPath)) console.error("fullPath is not a string: " + fullPath);

    let pp = fullPath.split("/");
    let name;
    
    for (let i = 0; i < pp.length; i++) {
        name = pp[i];
        // if (!obj[name]) {
        if (!Object.keys(obj).find(k => k === name)) {
            return null; // early out, key does not exist
        }
        else {
            obj = obj[name];
        }
    }
    return { name, obj };
}

/**
 * Tries to find an arbitrary node, given it's full path name
 * Possible that the node does not exist
 * Ex. "dir1/dir2/key" 
 */
ObjectTree.prototype.getNode = function(fullPath) {
    let it = _getByFullPath(this._value, fullPath);
    return it ? new ObjectTree(it.name, it.obj) : null;
};

/**
 * @param {String} name - deletes a key and it's value 
 */
ObjectTree.prototype.deleteChild = function(key) {
    delete this._value[key];
};

/**
 * Deletes an arbitrary node given it's full path name
 * In case the node does not exist the function return null
 * @param {String} fullPath - full path name, using / as separator
 */
ObjectTree.prototype.deleteNode = function(fullPath) {
    let st = fullPath.split("/").reverse();

    while(st.length) {
        let keys = Object.keys(this._value);
        let pwd = st.pop();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key === pwd) {
                if (st.length) {
                    break;
                }
                else {
                    delete pwd[key];
                }
            }
            else {
                return null;
            }            
        }
    }

};

/**
 * @param {String} name - tries to find a node with this name
 * @returns first occurance of name as a key
 */
ObjectTree.prototype.find = function (name) {
    if (!__.checkString(name)) return;

    bbb.dc = true;
    let found = { id: "not found" };

    const _find = (node) => {
        if (node.id === name) {
            found = node;
            return false;
        }
    };

    let nodeInfo = {
        depth: 0
    };

    _preOrder(this._obj, _find, nodeInfo, true);

    return found;
};

/**
 * @param {Function} visitor - function which is called for each node
 */
ObjectTree.prototype.traverse = function (visitor) {
    if (!__.checkFunction(visitor)) return;

    let nodeInfo = {
        depth: 0,
        isLastChild: 1
    };

    bbb.dc = true;

    _preOrder(this._value, visitor, nodeInfo);
};

// this is a sample visit function for the traverse function
ObjectTree.Printer = (node) => {
    
    //"RIGHT TACK, Unicode: U + 22A2, UTF - 8: E2 8A A2"
    let tabs = Array.from({ length: node.depth - 1 }, () => ".  ").join("");

    let str = "";
    if (!(__.checkObject(node.data) || __.checkArray(node.data))) {
        str = ": " + JSON.stringify(node.data);
    }
    
    console.log(tabs + node.id + str);
};


module.exports = ObjectTree;

