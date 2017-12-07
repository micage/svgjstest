import * as __ from "../Util/ParamCheck";
import ReplicateTree from "../Structures/ReplicateTree";
import * as DOM from "./Elements";

import styles from "./TreeViewFlagged.less";

const file = "TreeViewFlagged.js >> "; // for logging only

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

    Events that lead to a change of data:
    change: 
    input: validate, if it's ok take it, otherwise don't, the validate function is
            user domain: validate = String => Boolean;

    How to associate a ListItem of the TreeView with a node from the data tree?
    Way 1: climb up the DOM until is reaches the root of the tree
            concatanate each nodes id using a path separator e.g. '/'.
            With this full path name we can call 
            ObservableTree.modifyNodeName(fullPath, newName);

    What is a TreeView capable of?
        create, triggered by a button (what kind of node? classes?),
            sends a message to create a node to ObservableTree
        modify, triggered by change event 
        delete, triggered by button or key
        cut, copy, paste, triggered by key (STRG-X, STRG-C, STRG-V)
        select, triggered by click
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

function onClickNode(ev) {
    // clicked node becomes the 'selected' one
    console.log(file + 'target: ' + ev.target + ', currentTarget: ' + ev.currentTarget);
}

/**
 * @private
 */
function onNodeLabelDblClick(ev) {
    console.log(file + 'dblclick -> target: ' + ev.target + ', currentTarget: ' + ev.currentTarget);
    let label = ev.currentTarget;
    let parent = label.parentNode;

    // change label to an editable text field, CHK: weird DOM-Exceptions
    let input = DOM.Input({
        attr: {
            defaultValue: label.innerText
        },
        listenTo: {
            change: (ev) => {
                let text = input.value;
                label.innerText = text;
                console.log('Label changed');

                try { parent.replaceChild(label, input) } catch (e) {}
            },
            keyup: (ev) => { 
                if (ev.keyCode == 27) {
                    input.value = label.innerText;
                    console.log('cancel input: ' + input.value);
                    try { parent.replaceChild(label, input) } catch (e) { }
                }
                else if (ev.keyCode == 13) {
                    console.log('accept input: ' + input.value);
                    try { parent.replaceChild(label, input) } catch (e) { }
                }             
            },
            focusout: (ev) => {
                try { parent.replaceChild(label, input) } catch (e) { }
            }
        }
    });

    parent.replaceChild(input, label);
    input.focus();
}

/** 
 * callback for ReplicateTree function
 * @private
 * @type {HTMLUListElement|null}
 * @param {HTMLUListElement|null} parent
 * @param {Object|null} nodeInfo
 * @param {String} nodeInfo.id
 * @param {Boolean} nodeInfo.hasChildren
 */
function createNode(parent, nodeInfo) {
    if (!parent) {
        // a node without a parent is the root of the tree
        // note that the nodeInfo param is not evaluated in this case
        // and we just return a plain UL-element
        return DOM.UnorderedList();
    }

    // create tree node with associated flags
    let itemArgs = {
        children: [
            DOM.Div({
                class: styles["list-item-box"],
                listenTo: {
                    click: (ev) => onClickNode(ev)
                },
                children: [
                    // flag icons
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
                        ]
                    }),
                    // tree node
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
                                text: nodeInfo.id,
                                listenTo: {
                                    dblclick: (ev) => onNodeLabelDblClick(ev)
                                }
                            }),
                        ]
                    }),
                ]
            })
        ]
    };

    let ul = null;

    if (nodeInfo.hasChildren) {
        ul = DOM.UnorderedList();

        // ul will be parent in the next call of createNode
        itemArgs.children.push(ul);
    }

    let child = DOM.ListItem(itemArgs);
    parent.appendChild(child);

    // for leaf nodes this will return null
    // if this node has no children the return value will not be used
    // otherwise the returned "UL" it will be parent in the next call
    return ul;
}

/**
 * Creates a DOM-Tree by traversing a tree using ReplicateTree
 * The tree has to provide a traverse function: see ObjectTree.js for details
 * optional filter function (args.skipNode): nodeInfo => boolean
 * to react on select -> args.listenTo.mgSelect
 * 
 * @param {Object} args
 * @param {Object} args.container - needs to have a traverse function
 * @param {Function} [args.skipNode] - optional, node will be skipped if function returns true
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
            console.warn("CreateFlaggedTreeView: a tree has no user defined children, ignoring");
        }
    }

    // if (!__.checkObject(args.listenTo)) args.listenTo = {} // CHK!

    if (__DEBUG__) {
        // console log what has been clicked
        args.listenTo = {
            click: (ev) => {
                console.log(ev.target); 
            }
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
