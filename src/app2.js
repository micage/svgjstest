import * as __ from "./Util/ParamCheck";
import * as DOM from "./DOM/Elements";
import ObjectTree from "./Structures/ObjectTree";
import { NodePrinter } from "./Structures/ObjectTree";
import ReplicateTree from "./Structures/TreeReplicator";
import SplitView from "./DOM/SplitView";
import TreeViewFlagged from "./DOM/TreeViewFlagged";

import styles from "./app2.less";
import "../fonts/icomoon2/style.css"; // icomoon svg font
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

const skipNode = (nodeInfo) => 
    (nodeInfo.id.includes("21") || 
    (typeof nodeInfo.data === "number"));

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

if (1) {
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
}

// ================================================================
// creates an object literal, which is then printed to console via ObjectTree/NodePrinter
if (0) {
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
}


// ================================================================
// replicate a tree by using a simple NodeInfo Array
// that traverses by just iterating over the array
// it stops iterating if the callback returns false

function CreateRandomNodes(numNodes) {
    const probLast = 0.3;

    const f = v => 1/(1+.6) * (.6 + Math.sqrt(v));

    return Array.from({ length: numNodes }, (v, i) => ([
        i,
        (Math.random() > f(i / numNodes) ? 2 : 0) |
        (Math.random() < probLast ? 1 : 0)
    ]));
}

function InfoArrayTraversor(nodes) {
    return {
        traverse: (cb) => {
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var ni = {
                    id: n[0],
                    hasChildren: n[1] & 2,
                    isLastChild: n[1] & 1
                };
                if (cb(ni) === false) {
                    break;
                }
            }
        }
    }
}
var nodes = [[0, 2], [1, 0], [2, 3], [3, 0], [4, 2], [5, 0], [6, 3], [7, 2], [8, 0], [9, 0], [10, 2], [11, 1], [12, 1], [13, 0], [14, 1], [15, 1], [16, 2], [17, 0], [18, 3], [19, 0], [20, 0], [21, 0], [22, 1], [23, 1], [24, 0], [25, 1],];
var randomTree = InfoArrayTraversor(CreateRandomNodes(26));
var randomTree2 = InfoArrayTraversor(nodes);

var str = "var nodes = [";
randomTree.traverse((ni) => str += `[${ni.id}, ${(ni.hasChildren ? 2 : 0) | (ni.isLastChild ? 1 : 0)}], ` );
str += "];";
console.log(str);

if(0 && __DEBUG__) CheckInterface(args, {
        container: {
            traverse: Function
        },
        createNode: Function
    });


var obj2 = ReplicateTree({
    container: randomTree,
    createNode: function (parent, nodeInfo) {
        if (!parent) return {};
        parent[nodeInfo.id] = nodeInfo.hasChildren ? {} : ""; 
        return parent[nodeInfo.id];
    }
});
console.log("Random Tree:");
(new ObjectTree(obj2)).traverse(NodePrinter);



// =================================================================
if (module.hot) {
  module.hot.accept();
}
