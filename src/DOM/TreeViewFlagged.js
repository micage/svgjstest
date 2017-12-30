import * as __ from "../Util/ParamCheck";
import ReplicateTree from "../Structures/ReplicateTree";
import * as DOM from "./Elements";

import styles from "./TreeViewFlagged.less";

// constants
const file = "TreeViewFlagged.js >> "; // for logging only

// statics (shared over all instances of TreeViewFlagged)
let all = new WeakMap();
let all_nodes = {}; // hash for all produced nodes

/*
Remarks:
The buttons for the flags are really Two-State-Buttons
What about writing a N-State-Button class?
*/


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

function onEditLabel() {

}

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

function onClick(ev) {
    // ev.currentTarget is the HTMLElement that has this function as a listener
    // clicked node becomes the 'selected' one, just add style ".selected"
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

                try { parent.replaceChild(label, input) } catch (e) { } // CHK
            },
            keyup: (ev) => { 
                if (ev.keyCode == 27) {
                    input.value = label.innerText;
                    console.log('cancel input: ' + input.value);
                    try { parent.replaceChild(label, input) } catch (e) { } // CHK
                }
                else if (ev.keyCode == 13) {
                    console.log('accept input: ' + input.value);
                    try { parent.replaceChild(label, input) } catch (e) { } // CHK
                }             
            },
            focusout: (ev) => {
                try { parent.replaceChild(label, input) } catch (e) { } // CHK
            }
        }
    });

    parent.replaceChild(input, label);
    input.focus();
}

/** 
 * callback for the ReplicateTree function
 * 
 * Note: be careful where to place the event listener, 
 * ev.target is the Element you clicked 
 * ev.currentTarget is the element that is listening to events, 
 * it's an anchestor (or the same element) in the DOM hierarchy
 * 
 * @private
 * @type {HTMLUListElement|null}
 * @param {HTMLUListElement|null} parent
 * @param {Object|null} nodeInfo
 * @param {String} nodeInfo.id - used for the label string
 * @param {Boolean} nodeInfo.hasChildren
 * @returns {HTMLLIElement} - a list item a.k.a. <li>
 */
function createNode(parent, nodeInfo) {
    if (!parent) {
        // a node without a parent is the root of the tree
        // note that the nodeInfo param is not evaluated in this case
        // and we just return a plain UL-element
        return DOM.UnorderedList();
    }

    // create tree-view node with associated flags as HTMLUListElement
    let itemArgs = {
        attr: {
            name: "node." + DOM.genId()
        },
        children: [
            DOM.Div({
                class: styles["list-item-box"],
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
                            // icon
                            DOM.Span({
                                class: [
                                    nodeInfo.hasChildren ? "icon-folder-open" : "icon-minus",
                                    styles.icon
                                ].join(" "),
                                listenTo: {
                                    click: (ev) => toggleFolder(ev.target)
                                }
                            }),
                            // label
                            DOM.Span({
                                class: styles.itemLabel,
                                text: nodeInfo.id, // nodeInfo.id -> label.innerHTML
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

    let child = DOM.ListItem(itemArgs); // creates an <li>

    parent.appendChild(child); // adds it to a parent, which is always a <ul>

    // for leaf nodes this will return null
    // if this node has no children the return value will not be used
    // otherwise the returned "UL" it will be parent in the next call
    return ul;
}

function getNextListItemBox(el) {
    let elem = el
    while (true) {
        if (elem.classList.contains(styles["list-item-box"])) {
            return elem;
        }
        elem = elem.parentNode;
    }
}

/**
 * Climbs up the DOM to construct a full path to the node
 * @param {HTMLDivElement} lib - list-item-box, the node
 * @returns {String} the full path
 */
function getFullPath(lib) {
    // jump over two parents (first is li, second is ul)
    // until parent of ul is the tree itself (a div TreeEditor__tree)

    let box = lib;
    let path = [];
    do {
        path.push(box.children.item(1).children.item(1).innerText);
        let parent = box.parentNode.parentNode.parentNode; // li or div
        box = parent.children.item(0);
    } while (box.classList.contains(styles["list-item-box"]))
    return path.reverse().join("/");
}

/**
 * Creates a DOM-Tree by traversing a tree using ReplicateTree
 * The tree has to provide a traverse function: see ObjectTree.js for details
 * optional filter function (args.skipNode): nodeInfo => boolean
 * to react on select -> args.listenTo.mgSelect
 * 
 * @param {Object} args - user object, interface for FlaggedTreeView
 * @param {Object} args.container - needs to have a traverse function
 * @param {Object} args.listenTo - callback functions
 * @param {Function} args.listenTo.selectNode
 * @param {Function} args.listenTo.createNode
 * @param {Function} args.listenTo.editNode
 * @param {Function} args.listenTo.deleteNode
 * @param {Function} [args.skipNode] - optional, node will be skipped if function returns true
 * @returns {HTMLDivElement} - which has a UL (the tree-view) as sole child
 */
export default
function CreateFlaggedTreeView(args)
{
    if (!__.checkObject(args.listenTo)) {
        args.listenTo = {} // CHK!
    }

    var calls = {};

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

    if (!__.checkObject(args.listenTo)) {
        if (__DEBUG__) {
            calls.selectNode = (node) => { console.log('calls.selectNode: ' + node.id); };
            calls.createNode = (node) => { console.log('calls.createNode: ' + node.id); };
            calls.editNode = (node) => { console.log('calls.editNode: ' + node.id); };
            calls.deleteNode = (node) => { console.log('calls.deleteNode: ' + node.id); };
        }
        else {
            calls.selectNode = () => {};
            calls.createNode = () => { };
            calls.editNode = () => { };
            calls.deleteNode = () => { };
        }
        args.listenTo = {};
    }

    if (!__.checkFunction(args.listenTo.selectNode)) {
        if (__DEBUG__) {
            calls.selectNode = (node) => { console.log('onSelectNode: ' + node.id); }
        }
        else {
            calls.selectNode = () => { }
        }
    }
    else {
        calls.selectNode = args.listenTo.selectNode;
    }

    if (!__.checkFunction(args.listenTo.createNode)) {
        if (__DEBUG__) {
            calls.createNode = (node) => { console.log('onCreateNode: ' + node.id); }
        }
        else {
            calls.createNode = () => { }
        }
    }
    else {
        calls.createNode = args.listenTo.createNode;
    }

    if (!__.checkFunction(args.listenTo.editNode)) {
        if (__DEBUG__) {
            calls.editNode = (node) => { console.log('editNode: ' + node.id); }
        }
        else {
            calls.editNode = () => { }
        }
    }
    else {
        calls.editNode = args.listenTo.editNode;
    }

    if (!__.checkFunction(args.listenTo.deleteNode)) {
        if (__DEBUG__) {
            calls.deleteNode = (node) => { console.log('deleteNode: ' + node.id); }
        }
        else {
            calls.deleteNode = () => { }
        }
    }
    else {
        calls.deleteNode = args.listenTo.deleteNode;
    }

    if (__DEBUG__ && __.checkFunction(args.listenTo.check)) { console.warn("check listener is not evaluated."); }

    /**
     * This is the central click handler for the tree-view
     * It has to resolve clicks on certain elements to user messages (e.g. createNode)
     * How to resolve the full path of a tree-node? Or save each node pointer together
     * with it's corresponding ObjectTree pointer?
     */
    function click (ev) {
        let treeView = ev.currentTarget;
        // ev.currentTarget is the tree-wrapping Div (-> self), will stay unchanged for all tree messages
        // ev.target is the actual sub-element that has been clicked
        // have to get a pointer to the user interface (calls)
        console.log(ev.target);

        // now transform DOM messages to our messages
        // a WeakMap is used to resolve the user interface pointer calls (function table)
        // by a pointer to self (HTMLDivElement)
        // with this we can call functions directly (without sending messages through the DOM)
        // 1. click on label:
        // 2. click on icon: toggles sub-tree visibility
        // 3. click on list-item-div (): 
        // 4. click on list-item-flags (): 
        // 5. click on list-item-box (): this is a complete line representing a node
        // 6. it's possible to click on the tree itself -> do nothing
        // 1-5. a click will select this node
        
        // list-item-box (div, parent is li)
        //   list-item-flags (div)
        //     icon (span)
        //   list-item-div (div)
        //     icon (span)
        //     itemLabel (span)

        // we may need a function that climbs up the DOM-Tree beginning at ev.target
        // and return the next list-item-box (to set the selected class)

        // we may also need a function that climbs up the DOM-Tree beginning at the selected
        // list-item-box and returns a full path

        let box = getNextListItemBox(ev.target);
        let oldSelection = ev.currentTarget.getElementsByClassName(styles.selected);
        if (oldSelection.length) {
            let elem = oldSelection.item(0);
            elem.classList.remove(styles.selected);
        }
        box.classList.add(styles.selected);
        let path = getFullPath(box);

        let calls = all.get(ev.currentTarget);
        calls.selectNode(path); // give a full path here
    }
    args.listenTo = { click }; // overwrites the argument value which has been copied to calls

    /** @type {HTMLUListElement} */
    var root = ReplicateTree({
        container: args.container,
        createNode,
        skipNode: args.skipNode
    });
    delete args.container;
    delete args.skipNode;

    args.children = [root]; // a tree has no user defined children, only root ul

    let _self = DOM.Div(args); // wrap tree in a div

    all.set(_self, calls); // save all instances together with it's interface pointer in a WeakMap
    
    return _self;
};
