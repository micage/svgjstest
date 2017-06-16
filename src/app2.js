import * as __ from "./Util/ParamCheck";
import * as DOM from "./DOM/Elements";
import ObjectTree from "./Structures/ObjectTree";
import { NodePrinter } from "./Structures/ObjectTree";
import ReplicateTree from "./Structures/TreeReplicator";
import SplitView from "./DOM/SplitView";
import TreeViewFlagged from "./DOM/TreeViewFlagged";

import styles from "./app2.less";
import "../fonts/icomoon/style.css"; // icomoon svg font
// const icons = require("../fonts/style.css"); // icomoon svg font

if (__DEBUG__) console.log("Debug Mode");

// some test data
let test2 = {
    name: "Heinz",
    age: 42,
    job: {
        city: "Berlin", 
        type: "IT"
    },
    i1: {
        i11: {
            i111: "Vogel",
            i112: {
                i1121: {
                    i11211: "i11211 data"
                },
                x: 0, 
                y: null,
                w: 400
            },
            // i113: "test",
        },
        i12: {
            i121: "i121 data"
        }
    },
    i2: "i2 data",
    i3: "i3 data"
};

let filter = [
    (n, c) => n.id.includes(c),
    (n, str) => typeof n.data === str
];
const skipNode = (nodeInfo) => 
    (nodeInfo.id.includes("21") || 
    (typeof nodeInfo.data === "number"));
// const skipNode = (nodeInfo) => nodeInfo.id.includes("121");
let skipNodeStr = "<pre>Filtered: skip(nodeInfo) {\n\t" + 
    skipNode.toString().match(/(\breturn\b.*)/g) + 
    "\n}</pre>";

let objTree = new ObjectTree(test2);

// ================================================================
// creates DOM nodes
// Note that you have not to care about tree structure here
// all left to do is create a Node from NodeInfo
function createNode2(parent, nodeInfo) {

    if (!parent) { // its root
        return DOM.UnorderedList();
    }

    let nodeLabelText = nodeInfo.id + 
        ((!__.checkObject(nodeInfo.data) && !__.checkArray(nodeInfo.data)) ?
            ": " + nodeInfo.data : "");


    // create list item content
    let itemArgs = {
        children: [
            DOM.Div({
                class: styles["list-item-div"],
                children: [
                    DOM.Span({
                        class: [
                            nodeInfo.hasChildren ? "icon-folder-open" : "icon-minus", 
                            styles.icon
                        ].join(" ")
                    }),
                    DOM.Span({ class: styles.itemLabel, innerText: nodeLabelText }),
                ]
            }),
        ]
    };

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

var rootOriginal = ReplicateTree({
    container: objTree,
    createNode: createNode2,
});

var rootFiltered = ReplicateTree({
    container: objTree,
    createNode: createNode2,
    skipNode
});

DOM.App(
    DOM.Div({
        children: [
            SplitView({
                class: styles.SplitView,
                children: [
                    // original tree
                    DOM.Div({ class: styles.one, children: [                    
                        DOM.Div({ class: styles.viewHeader, innerText: "Original" }),       
                        DOM.Div({
                            class: styles.tree, children: [rootOriginal]
                        })
                    ]}),
                    // filtered tree
                    DOM.Div({ class: styles.two, children: [
                        DOM.Div({ 
                            class: styles.viewHeader, 
                            innerHTML: skipNodeStr
                        }),       
                        // DOM.Div({
                        //     class: styles.tree, children: [rootFiltered]
                        // }),
                        TreeViewFlagged({
                            class: styles.tree, container: objTree, skipNode
                        }),
                    ]}),
                ]
            }),
        ]
    })
);

// ================================================================
// creates an object literal, which is then printed to console via ObjectTree/NodePrinter
console.log("\nOriginal Tree:");
objTree.traverse(NodePrinter);
var obj = ReplicateTree({
    container: objTree,
    createNode: function (parent, nodeInfo) {
        if (!parent) return {};
        // 'parent' is just an object here, so we add a key and set its value.
        parent[nodeInfo.id] = nodeInfo.hasChildren ? {} : nodeInfo.data

        return parent[nodeInfo.id];
    },
    skipNode // apply filter
});
console.log("\nReplicated Tree:");
(new ObjectTree(obj)).traverse(NodePrinter);
console.log("");


// =================================================================
if (module.hot) {
  module.hot.accept();
}
