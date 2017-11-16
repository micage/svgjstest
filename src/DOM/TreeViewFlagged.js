import * as __ from "../Util/ParamCheck";
import ReplicateTree from "../Structures/ReplicateTree";
import * as DOM from "./Elements";

import styles from "./TreeViewFlagged.less";

/*
What distinguishes a TreeViewFlagged from a TreeView is that list items
have a nested and an additional unnested part. The nested part gets its offset by
the 'padding-left' style of the nested 'li' elements. The 'normal' part
is positioned absolut with respect to the tree container.

nodeInfo = {
    id, hasChildren, isLastChild, data = { prop1, prop2, ... }
}
.tree.li
    div.nested
        cell.prop[=id]
    div.unnested // position absolute, left or right?
        cell.prop
        cell.prop
        ...

TODO: -> args
  - the decision of what to do with skipped nodes is user domain:
    user has to provide a callback that will be called with the skipped
    node and its parent node
    If no callback is provided, skipped nodes are just ... skipped.

    tree icons and labels are user domain:

    Events: 
        mgTvOnLock(nodeId): 
        mgTvOnSelect: send old and new selection

    Flag Icons and their click handler are user domain
    => pass an array of OnOff-Action structs, actually these are arguments for
        creating TwoStateButtons(args)
        [{
            on: "icon-on",
            off: "icon-off"
            action: (on) => {} // boolean is true (= on) or false (= off)
        },
        ...
        ]    
    if no flags are given TreeViewFlagged will just be a TreeView

    with element.cloneNode() it would be possible that a user provides an array
    of instantiated ButtonTwoState components for each desired flag, all coming
    with their click handlers setup.
*/

function toggleFolder(icon) {
    toggleFlag({
        icon, on: "icon-folder-open", off: "icon-folder",
        job: (onoff) => {
            icon.parentElement.parentElement.nextElementSibling.style.display =
                (onoff === "on" ? "" : "none");
        }
    });
}

function toggleLock(icon) {
    toggleFlag({
        icon, on: "icon-lock-open", off: "icon-lock",
        job: (onoff) => {
            console.log("node " + (onoff === "on" ? "unlocked" : "locked"))
        }
    });
}

function toggleEye(icon) {
    toggleFlag({
        icon, on: "icon-eye", off: "icon-eye-blocked",
        job: (onoff) => {
            console.log("node " + (onoff === "on" ? "visible" : "hidden"))
        }
    });
}

// args = { icon, onClass, offClass, job = ("on"|"off") => {} }
function toggleFlag(args) {
    let icon = args.icon;
    let cl = icon.classList;
    if (cl.contains(args.off)) {
        cl.remove(args.off);
        cl.add(args.on);
        args.job("on");
    }
    else if (cl.contains(args.on)) {
        cl.remove(args.on);
        cl.add(args.off);
        args.job("off");
    }
}

/**
 * Creates a tree from a container that traverses over NodeInfo structs
 * e.g. ObjectTree
 * optional filter function (args.skipNode)
 * to react on select -> args.listenTo.mgSelect
 * 
 * @param {Object} args
 * @param {Object} args.container 
 * @param {Function} args.container.traverse
 * @param {Function} args.skipNode - node will be skipped if function returns true
 * @type {HTMLDivElement}
 */
export default
function CreateFlaggedTreeView(args)
{
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
        if (__.checkObject(args.children)) {
            console.warn("CreateFlaggedTreeView: a tree has no user defined children");
        }
    }

    if (!__.checkObject(args.listenTo)) args.listenTo = {}

    /** callback for ReplicateTree function
     * @type {HTMLUListElement|null}
     */ 
    function createNode(parent, nodeInfo)
    {
        if (!parent) {
            // its root, note that the nodeInfo param is not evaluated in this case
            // and we safely omit it for a root node and return a plain UL-element
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
                                    class: "icon-eye " + styles.icon,
                                    listenTo: {
                                        click: (ev) => toggleEye(ev.target)
                                    }
                                }),
                                DOM.Span({
                                    class: "icon-lock " + styles.icon,
                                    listenTo: {
                                        click: (ev) => toggleLock(ev.target)
                                    }
                                })
                        ]}),
                        DOM.Div({
                            class: styles["list-item-div"],
                            children: [
                                DOM.Span({
                                    class: [
                                        nodeInfo.hasChildren ? "icon-folder-open" : "icon-minus",
                                        styles.icon
                                    ].join(" "),
                                    listenTo: {
                                        click: (ev) => toggleFolder(ev.target)
                                    }
                                }),
                                DOM.Span({
                                    class: styles.itemLabel, 
                                    text: nodeInfo.id
                                }),
                        ]}),
                ]})
        ]};

        let ul = null;

        if (nodeInfo.hasChildren) {
            ul = DOM.UnorderedList();

             // will be parent in the next call
            itemArgs.children.push(ul);
        }

        let child = DOM.ListItem(itemArgs);
        parent.appendChild(child);

        // for leaf nodes this will return null
        // if this node has no children the return value will not be used
        // otherwise the returned "UL" it will be parent in the next call
        return ul;
    }

    args.listenTo = {
        click: (ev) => {
            console.log(ev.target); 
        }
    }

    /** @type {HTMLUListElement} */
    var root = ReplicateTree({
        container: args.container,
        createNode,
        skipNode: args.skipNode
    });
    delete args.container;
    delete args.skipNode;

    args.children = [root]; // a tree has no user defined children, only root ul

    let self = DOM.Div(args); // wrap tree in a div
    return self
};
