"use strict";
const __ = require("../Util/ParamCheck");

/** A recursively called function that tracerses the hierarchy of a javascript object
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
 * @param {Object} obj - the object that represents the tree
 */
const ObjectTree = function(name, obj)
{
    if(__DEBUG__) {
        if (!__.checkString(name))
            console.error(" ObjectTree(name, obj) - name is not a string: " + name);
    }

    this._name = name;

    if (__.checkObject(obj) || __.checkArray(obj)) {
        this._obj = obj;
        this._value = null;
    }
    else {
        this._obj = null;
        this._value = obj;
    }
};

ObjectTree.prototype.setValue = function (value) {
    this._value = value;
};

ObjectTree.prototype.getValue = function () {
    return this._value;
};

Object.prototype.getObject = function () {
    return this._obj;
};

/**
 * Tries to find an arbitrary node, given it's full path name
 * Possible that the node does not exist 
 */
ObjectTree.prototype.getChild = function (name) {
    let obj = this._obj[name];
    return new ObjectTree(name, obj);
};

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
    return {name, obj};
}

/**
 * Tries to find an arbitrary node, given it's full path name
 * Possible that the node does not exist
 * Ex. "dir1/dir2/key" 
 */
ObjectTree.prototype.getNode = function (fullPath) {
    let it = _getByFullPath(this._obj, fullPath);
    return it ? new ObjectTree(it.name, it.obj) : null;
};

/**
 * @param {String} name
 * @param {String|Number|Array|Object} value
 */
ObjectTree.prototype.setChild = function (name, value) {
    if (!this._obj) {
        this._obj = {};
    }

    this._obj[name] = value;
};

/**
 * Sets the value of an arbitrary node given it's full path name
 * Creates intermediate parent nodes if they do not exist
 */
ObjectTree.prototype.setNode = function (fullPath, value) {
    return {};
};

/**
 * @param {String} name - deletes a child node by name
 */
ObjectTree.prototype.deleteChild = function (name) {
    let obj = this._obj[name];
    let ret;

    if (!obj) {
        if (__DEBUG__) console.warn("There is no child with this name: " + name);
        return null;
    }
    else {
        if (__.checkObject(obj) || __.checkArray(obj)) {
            ret = new ObjectTree(name, obj);
        }
        else {
            ret = obj;
        }
        delete this._obj[name];
        return ret;
    }
};

/**
 * Deletes an arbitrary node given it's full path name
 * In case the node does not exist the function does nothing
 * @param {String} fullPath - full (absolute) path name
 */
ObjectTree.prototype.deleteNode = function (fullPath) {

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
 * @param {Function} visitFunc - walks a tree
 */
ObjectTree.prototype.traverse = function (visitFunc) {
    if (!__.checkFunction(visitFunc)) return;

    let nodeInfo = {
        depth: 0
    };

    bbb.dc = true;
    _preOrder(this._obj, visitFunc, nodeInfo);
};

ObjectTree.Printer = (node) => {
    
    //"RIGHT TACK, Unicode: U + 22A2, UTF - 8: E2 8A A2"
    let tabs = Array.from({ length: node.depth - 1 }, () => ".  ").join("");

    let str = "";
    if (!__.checkObject(node.data) && !__.checkArray(node.data)) {
        str = ": " + JSON.stringify(node.data);
    }
    
    console.log(tabs + node.id + str);
};


module.exports = ObjectTree;

