"use strict";
import * as __ from "../Util/ParamCheck";

const NodePrinter = (node, breakCondition) => {
    let tabs = Array.from({ length: node.depth }, () => ".  ").join("");
    if (breakCondition && breakCondition()) return false; // stops traversal if condition fits
    let str = "";
    if (!(node.data instanceof Object)) {
        str = " -> " + node.data;
    }
    console.log(tabs + node.id + str);
};


class ObjectTree {
    constructor(json, options) {
        this._json = json;
    }

    _preOrder(obj, cb, node) {
        if (!obj || typeof obj !== "object") return;
        // if (!__.checkObject(obj)) {
        //     return;
        // }

        let keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            if (node.doContinue === false) break; // callback returned false;

            let key = keys[i];
            var child = obj[key];
            // node.hasChildren = true;
            node.hasChildren = !!Object.keys(child).length;
            node.numChildren = Object.keys(child).length;

            if (Array.isArray(child)) {
                node.id = key + "[" + child.length + "]";
            }
            else if (child && typeof child === "object") {
                node.id = key;
                // node.hasChildren = !!Object.keys(child).length;
                // node.numChildren = Object.keys(child).length;
            }
            else {
                node.hasChildren = false;
                node.numChildren = 0;
                node.id = key;
            }

            node.data = child;
            node.isLastChild = i === keys.length - 1;
            node.depth++;

            cb(node); // call visitor, node is changed by callee
            this._preOrder(child, cb, node); // -> recursion

            node.depth--;
        }
    }

    traverse(visitor) {
        if (typeof this._json !== "object") return;

        let nodeInfo = {
            depth: 0
        };
        this._preOrder(this._json, visitor, nodeInfo);
    }

}

//module.exports = ObjectTree;

export { ObjectTree as default, NodePrinter };
