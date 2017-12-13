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
const ObjectTree = function(obj)
{
    this._obj = __.checkObject(obj) ? obj : {};
}

/**
 * @returns {Object} - an empty object
 */
ObjectTree.prototype.addNode = function (fullPath) {
    return {};
}

/**
 * tries to find the node and returns the associated data object
 */
ObjectTree.prototype.getNode = function (fullPath) {
    return {};
}

/**
 * 
 */
ObjectTree.prototype.deleteNode = function (fullPath) {

}

/**
 * @param {Function} visitFunc - walks a tree
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

