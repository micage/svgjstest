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
const _preOrder = function(obj, cb, nodeInfo)
{
    if (!obj || typeof obj !== "object") return;
    // if (!__.checkObject(obj)) {
    //     return;
    // }

    let keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        if (nodeInfo.doContinue === false) break; // callback returned false;

        let key = keys[i];
        var child = obj[key];
        nodeInfo.id = key;

        if (child === null || child === undefined) {
            nodeInfo.numChildren = 0;
        }
        else if (Array.isArray(child)) {
            nodeInfo.id = key + "[" + child.length + "]";
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

        cb(nodeInfo); // call visitor, nodeInfo is changed by callee
        _preOrder(child, cb, nodeInfo); // -> recursion

        nodeInfo.depth--;
    }
}

/**
 * @constructor
 * @param {Object} obj - the object that represents the tree
 */
const ObjectTree = function(obj)
{
    this._obj = __.checkObject(obj) ? obj : {};
}

ObjectTree.prototype.traverse = function (visitFunc)
{
    if (!__.checkFunction(visitFunc)) return;

    let nodeInfo = {
        depth: 0
    };
    
    _preOrder(this._obj, visitFunc, nodeInfo);
};

ObjectTree.Printer = (node) => {
    let tabs = Array.from({ length: node.depth - 1 }, () => ".  ").join("");

    let str = "";
    if (!__.checkObject(node.data) && !__.checkArray(node.data)) {
        str = ": " + JSON.stringify(node.data);
    }
    
    console.log(tabs + node.id + str);
};


module.exports = ObjectTree;

