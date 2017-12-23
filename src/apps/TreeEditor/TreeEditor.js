import * as __ from "../../Util/ParamCheck";
import * as DOM from "../../DOM/Elements";
import ObjectTree from "../../Structures/ObjectTree";
// import { NodePrinter } from "./Structures/ObjectTree";
import * as Obs from "../../Structures/Observable";
// import ReplicateTree from "./Structures/ReplicateTree";
import SplitView from "../../DOM/SplitView";
import TreeViewFlagged from "../../DOM/TreeViewFlagged";
import Button from "../../DOM/Button";

// local imports
import styles from "./TreeEditor.less";
import "../../../fonts/icomoon/style.css"; // icomoon svg font

if (__DEBUG__) console.log("Debug Mode");
const FILE = "TreeEditor: ";

let ids = {
    idLeftPane: DOM.genId(),
    idRightPane: DOM.genId(),
    idLeftTreeView: DOM.genId(),
    idRightTreeView: DOM.genId(),
}

// our model - that provides a tree structure
// we have to be able to perform basic operations (create, edit, delete)
// objTree.createNode();
// objTree.editNode();
// objTree.deleteNode();

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
var objTree = new ObjectTree("test2", test2);

// view
var views = {
    tvOriginal: null,
    nodeViewer: null
};

let cbs = {
    onSelectNode: (path) => {
        console.log(FILE + path);
    },
    onCreateNode: (path) => {
        console.log(FILE + path);
    },
    onEditNode: (path) => {
        console.log(FILE + path);
    },
    onDeleteNode: (path) => {
        console.log(FILE + path);
    }
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
                                            DOM.Span({ class: styles["col-header"], text: "Tree View" }),
                                        ]
                                    })
                                ]
                            }),
                            // tool-bar
                            DOM.Div({
                                class: styles['tool-bar'],
                                children: [
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
                                class: styles.tree, 
                                container: objTree,
                                listenTo: {
                                    selectNode: cbs.onSelectNode,
                                    createNode: cbs.onCreateNode,
                                    editNode: cbs.onEditNode,
                                    deleteNode: cbs.onDeleteNode,
                                }
                            }),
                        ]
                    }),
                    // two, node viewer
                    DOM.Div({
                        class: styles.two, children: [
                            // header
                            DOM.Div({
                                class: styles.viewHeader,
                                children: [
                                    DOM.Span({ class: styles["col-header"], text: "Node View" })
                                ]
                            }),
                            // tree-view
                            views.nodeViewer = DOM.Div({
                                class: styles["node-viewer"]
                            }),
                        ]
                    }),
                ]
            }),
            DOM.Div({
                class: styles["status-bar"]
            })
        ]
    });
};
let root = createApp();
DOM.App(root);


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
