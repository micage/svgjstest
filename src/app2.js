import ObjectTree from "./Structures/ObjectTree";

// Abteilung 2
let NodePrinter = node => {
    let tabs = Array.from({length: node.depth}, () => "+--").join("");
    if (node.id === "i_11") return false; // stops traversal if condition fits
    console.log(tabs + node.id + (node.hasChildren ? "" : ": " + node.data));
};

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
                x: 0, 
                y: 0, 
                w: 400
            },
        },
        i12: {
            i121: "i121 data"
        }
    },
    i2: "i2 data",
    i3: "i3 data"
};


export default
function ReplicateTree(args) {
    var objTreeTest2 = new ObjectTree(test2);

    if (__DEBUG__) {
        console.log("\n\nOriginal Tree: ")
        objTreeTest2.traverse(NodePrinter); // original tree
    }

    var root = {}; // of new tree
    var ancestors = [{ node:root, isLast: true }];
    var skipAncestors = [];
    var skipMode = false;

    /**
     * @param {Object} node - dep1 node
     * @return {Object} - dep2 node
     */
    function createNode(parent, node) {
        // 'parent' is just an object here, so we just add a key and set its value.
        // This has not always to be the case.
        // 'parent' could also be any arbitrary class that is able to 
        // create and add a child node.

        parent[node.id] = node.hasChildren ? {} : node.data
        
        return parent[node.id];
    }

    function skipNode(node) {

        console.log(node.id + ': ' + node.data + ' -> omitted');

        if (node.hasChildren) {
            skipAncestors.push(node);
        }
        else if (node.isLastChild) {
            while (skipAncestors.length && (skipAncestors.pop()).isLastChild) {}
            while (ancestors.length > 1 && (ancestors.pop()).isLast) {}
        }
        if (!skipAncestors.length) {
            skipMode = false;
        }
    }

    function onNode(node) {

        // How to rewrite that? Looks strange, but works.
        if (!!args.omitNode) {
            if (skipMode) {
                skipNode(node);
                return;
            }
            else {
                skipMode = args.omitNode(node);
                if (skipMode) {
                    skipNode(node);
                    return;
                }
            }
        }
        
        let currentParent = ancestors[ancestors.length-1].node;

        // attach node to parent
        let child = createNode(currentParent, node);

        if (node.hasChildren) {
            ancestors.push({
                node: child, // this will be parent on the next call
                isLast: node.isLastChild
            });
        }
        else if (node.isLastChild) {
            while (ancestors.length > 1 && (ancestors.pop()).isLast) {}
        }
    }

    objTreeTest2.traverse(onNode);

    if (__DEBUG__) {
        console.log("\n\nReplicated Tree:");
        let tree2 = new ObjectTree(root);
        tree2.traverse(NodePrinter);
    }

    return root;
}

if (__DEBUG__) {
    var tree = ReplicateTree({
        doNode: (node) => {
        },
        omitNode: (node) => node.id.includes("i") || node.data === "Vogel"
        // omitNode: (node) => node.id.includes("2") || node.data === "Vogel"
        // omitNode: (node) => node.id === "w"
    });
}

// =================================================================
if (module.hot) {
  module.hot.accept();
}
