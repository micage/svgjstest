import * as __ from "./../../Util/ParamCheck";
import * as DOM from "./../../DOM/Elements";
import * as SVG from "./../../svg/Elements";
import ObjectTree from "./../../Structures/ObjectTree";
import { NodePrinter } from "./../../Structures/ObjectTree";
import * as Obs from "./../../Structures/Observable";
import ReplicateTree from "./../../Structures/ReplicateTree";
import SplitView from "./../../DOM/SplitView";
import TreeViewFlagged from "./../../DOM/TreeViewFlagged";
import Button from "./../../DOM/Button";

// styles
import styles from "./TreeReplicator.less";
import "../../../fonts/icomoon/style.css"; // icomoon svg font

if (__DEBUG__) console.log("Debug Mode");

// observed string that watches the content of the edit field
// and builds a new tree after being changed
let condition = new Obs.ObservableValue("", (val) => {
    console.log("condition changed: " + val);

    let parent = views.tvFiltered.parentElement;
    let newTv = TreeViewFlagged({
        class: styles.tree, 
        container: objTree, 
        skipNode: (nodeInfo) => nodeInfo.id.includes(val) && !!val
    });
    parent.replaceChild(newTv, views.tvFiltered);
    views.tvFiltered = newTv;
});

let ids = {
    idLeftPane: DOM.genId(),
    idRightPane: DOM.genId(),
    idLeftTreeView: DOM.genId(),
    idRightTreeView: DOM.genId(),
}

// model
let test2 = {
    people: [
        { name: "Heinz", age: 42, hobbies: ["diving", "boulder", "cinema"] },
        { name: "Gabi", age: 22, hobbies: ["biking", "soccer"] },
        { name: "Bernd", age: 32, hobbies: ["cooking", "dancing", "barbecue"] }
    ],
    job: {
        type: "IT",
        city: "Güntzelsau", 
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
            i113: "Ente",
        },
        i12: {
            i121: "i121 data"
        }
    },
    i2: "i2 data",
    i3: "i3 data"
};
var objTree = new ObjectTree(test2);

// view
var views = {
    tvOriginal: null,
    tvFiltered: null
};

// ================================================================
// TreeVisitor that creates a HTMLLIElement
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
                    DOM.Span({ class: styles.itemLabel, text: nodeLabelText }),
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

const createApp = () => {
    return DOM.Div({
        children: [
            SplitView({
                class: styles.SplitView,
                children: [
                    // one, original tree
                    DOM.Div({
                        class: styles.one, children: [
                            // header
                            DOM.Div({
                                class: styles.viewHeader,
                                children: [
                                    DOM.Div({
                                        children: [
                                            DOM.Span({ class: styles["col-header"], text: "Original Tree" }),
                                            DOM.Span({ text: "id.contains:" }),
                                            DOM.Input({
                                                id: "xxx",
                                                class: styles.condition,
                                                listenTo: {
                                                    change: (ev) => { condition.value = ev.target.value; }
                                                }
                                            }),
                                        ]
                                    })
                                ]
                            }),
                            // tool-bar
                            DOM.Div({
                                class: styles['tool-bar'],
                                children: [
                                    // DOM.Span({
                                    //     // text: "create",
                                    //     class: styles['button'],
                                    //     listenTo: {
                                    //         click: (ev) => {                                                    
                                    //             console.log("clicked create: " + ev.target.className);
                                    //         }
                                    //     },
                                    //     children: [Icons.star8]
                                    // }),
                                    // DOM.Span({
                                    //     class: styles['button'],
                                    //     listenTo: {
                                    //         click: () => {
                                    //             console.log("clicked delete");
                                    //         }
                                    //     },
                                    //     children: [Icons.recycleBin]
                                    // }),
                                    Button({
                                        id: "button" + DOM.genId(),
                                        iconName: "clipboard",
                                        action: (elem) => {
                                            console.log("Toot " + elem.id)
                                        }
                                    }),
                                    Button({
                                        id: "button" + DOM.genId(),
                                        iconName: "circleUp",
                                        action: (elem) => {
                                            console.log("Toot " + elem.id)
                                        }
                                    }),
                                    Button({
                                        id: "button" + DOM.genId(),
                                        iconName: "arrowUp",
                                        action: (elem) => {
                                            console.log("Toot " + elem.id)
                                        }
                                    }),
                                    Button({
                                        id: "button" + DOM.genId(),
                                        iconName: "starEmpty",
                                        action: (elem) => {
                                            console.log("Toot " + elem.id)
                                        }
                                    })
                                ]
                            }),
                            // tree-view
                            views.tvOriginal = TreeViewFlagged({
                                class: styles.tree, container: objTree
                            }),
                        ]
                    }),
                    // two, filtered tree
                    DOM.Div({
                        class: styles.two, children: [
                            // header
                            DOM.Div({
                                class: styles.viewHeader,
                                children: [
                                    DOM.Span({ class: styles["col-header"], text: "Filtered Tree" })
                                ]
                            }),
                            // tree-view
                            views.tvFiltered = TreeViewFlagged({
                                class: styles.tree, container: objTree
                            }),
                        ]
                    }),
                ]
            }),
        ]
    });
};
let root = createApp();
DOM.App(root);

// ================================================================
// creates a deep copy of an object, which is then printed to console 
// via ObjectTree/NodePrinter
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
        skipNode: null // filter function: nodeInfo => boolean
    });
    console.log("\nReplicated Tree:");
    (new ObjectTree(obj)).traverse(NodePrinter);
    console.log("");
}

// ================================================================
// replicate a tree by using a simple NodeInfo Array
// that traverses by just iterating over the array
// it stops iterating if the callback returns false
if(0 && __DEBUG__) {
    function CreateRandomNodes(numNodes) {
        const probLast = 0.3;

        const f = v => 1 / (1 + .6) * (.6 + Math.sqrt(v));

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
}

// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();

    // dispose handler
    module.hot.dispose(function () {
        // revoke the side effect
        root.remove();
    });

    DOM.mount();
}
