import * as __ from "../Util/ParamCheck";
import ReplicateTree from "../Structures/TreeReplicator";
import * as DOM from "./Elements";

import styles from "./TreeViewFlagged.less";

/*
TODO:
  - What to do with skipped nodes, call back to user?
    if its supposed to be a hidden node its id and data should somehow 
    be attached to the parent of the skipped node 

    onItemCreate -> set icon + label, treeview should povide defaults


*/


/**
 * Creates a tree from a container that traverses over NodeInfo structs
 * e.g. ObjectTree
 * optional filter function (args.skipNode)
 * to react on select -> args.listenTo.mgSelect
 */
export default
function CreateFlaggedTreeView(args) {
    if (__DEBUG__) {
        if (!__.checkObject(args)) {
            console.error("CreateFlaggedTreeView: no arguments provided");
            return null;
        }
        if (!__.checkObject(args.container)) {
            console.error("CreateFlaggedTreeView: no container provided");
            return null;
        }
        if (!__.checkFunction(args.container.traverse)) {
            console.error("CreateFlaggedTreeView: container has no traverse function");
            return null;
        }
    }

    if (!__.checkObject(args.listenTo)) args.listenTo = {}

    // creates DOM nodes
    // Note that you have not to care about tree structure here
    // all left to do is create a Node from NodeInfo
    function createNode(parent, nodeInfo) {

        if (!parent) { // its root
            return DOM.UnorderedList();
        }

        // create list item content
        let itemArgs = {
            children: [
                DOM.Div({
                    class: styles["list-item-box"],
                    children:[
                        DOM.Div({
                            class: styles["list-item-flags"],
                            children: [                             // this should be dynamic
                                DOM.Span({
                                    class: "icon-eye " + styles.icon
                                })
                        ]}),
                        DOM.Div({
                            class: styles["list-item-div"],
                            children: [
                                DOM.Span({
                                    class: [
                                        nodeInfo.hasChildren ? "icon-folder-open" : "icon-minus",
                                        styles.icon
                                    ].join(" ")
                                }),
                                DOM.Span({
                                    class: styles.itemLabel, 
                                    innerText: nodeInfo.id
                                }),
                        ]}),
                ]})
        ]};

        let ul = null;

        if (nodeInfo.hasChildren) {
            ul = DOM.UnorderedList();

            itemArgs.children.push(ul); // appended after .list-item-div, will be parent in the next call
        }

        let child = DOM.ListItem(itemArgs);
        parent.appendChild(child);

        // for leaf nodes this will return null
        // if this node has no children the return value will not be used
        // otherwise it will be parent in the next call
        return ul;
    }

    var root = ReplicateTree({
        container: args.container,
        createNode,
        skipNode: args.skipNode
    });
    args.children = [root]; // a tree has no user defined children, only root ul

    let self = DOM.Div(args);
    return self
};
