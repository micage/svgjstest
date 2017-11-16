import * as __ from "../Util/ParamCheck";
import ObjectTree from "./ObjectTree";

if (__DEBUG__) {
    var NodePrinter = require("./ObjectTree").NodePrinter;

    function createNode(parent, nodeInfo) {
        // 'parent' is just an object here, so we just add a key and set its value.
        // This has not always to be the case.
        // 'parent' could also be any arbitrary class that is able to 
        // create and add a child node.

        parent[nodeInfo.id] = nodeInfo.hasChildren ? {} : nodeInfo.data

        return parent[nodeInfo.id];
    }
}


/**
  @typedef NodeInfo
  @type {object}
  @property {string} id
  @property {boolean} hasChildren
  @property {boolean} isLastChild
 */

/**
 * @callback CreateNodeCb
 * @param { Node } parent - if !parent, create root, Node can be anything
 * @param { NodeInfo } childNodeInfo - if !parent this isn't used
 * @return { Node }
 * Note that you have not to care about tree structure here
 * all that is left to do is to create a Node from NodeInfo.
 * Also note that its totally up to the user what a created
 * node actually is. It can be 'undefined' if you wish so.
 * But it will reappear as 'parent' argument of the subsequent call
 * if nodeInfo.hasChildren is true.
 */

/**
 * @callback SkipNodeCB
 * @param { Node } node - currently tested node
 * @return { boolean } - if true, node and its descendants are skipped
 */

/**
 * @callback TraverseFunc
 * @param { NodeInfo } node - currently traversed node
 * @return { boolean } - if false, traversal is stopped
 */

/**
  @typedef ReplicateTreeArgs
  @type {object}
  @property {CreateNodeCb} createNode - creates a node and adds it to parent.
  @property {SkipNodeCB} skipNode - your name.
  @property {TraverseFunc} traverse - your age.
 */

/**
 * @param {ReplicateTreeArgs}
 * @return {object}
 */
export default
function ReplicateTree(args) {
    if (__DEBUG__) {
        if (!__.checkObject(args)) {
            return console.error("ReplicateTree: no argument provided.")
        }
        if (!__.checkObject(args.container)) {
            return console.error("ReplicateTree: no container provided.")
        }
        if (typeof args.createNode !== "function") {
            return console.error("ReplicateTree: no createNode function provided.")
        }
    }

    // createNode has to deal with undefined args (and create the root node)
    // at this point/context we haven't got a parent and also no nodeInfo
    // so we cannot provide it
    // Note: nodes created are completey opaque to ReplicateTree
    // if createNode decides to return nothing this will be ok.
    var root = args.createNode();
    
    // we know that root is last, there is only one root
    var ancestors = [{ node: root, isLast: true }];
    var skipAncestors = [];
    var skipMode = false;

    function skipNode(nodeInfo) {

        if (nodeInfo.hasChildren) {
            skipAncestors.push(nodeInfo);
            ancestors.push({ isLast: nodeInfo.isLastChild });
        }
        else if (nodeInfo.isLastChild) {
            while (skipAncestors.length && skipAncestors.pop().isLastChild) { }
            while (ancestors.length > 1 && ancestors.pop().isLast) { }
        }
        if (!skipAncestors.length) {
            skipMode = false;
        }
    }

    // visits traversable
    function onNode(nodeInfo) {

        // How to rewrite that? Looks strange, but works.
        if (!!args.skipNode) {
            if (skipMode) {
                skipNode(nodeInfo);
                return;
            }
            else {
                skipMode = args.skipNode(nodeInfo);
                if (skipMode) {
                    skipNode(nodeInfo);
                    return;
                }
            }
        }

        let currentParent = ancestors[ancestors.length - 1].node;

        // create a node from nodeInfo and add it to parent
        let child = args.createNode(currentParent, nodeInfo);

        if (nodeInfo.hasChildren) {
            ancestors.push({
                node: child, // this will be parent in the next call
                isLast: nodeInfo.isLastChild
            });
        }
        else if (nodeInfo.isLastChild) {
            while (ancestors.length && (ancestors.pop()).isLast) { }

            if (!(ancestors.length)) {
                return false;
            }
        }
    }

    args.container.traverse(onNode);

    return root;
}

