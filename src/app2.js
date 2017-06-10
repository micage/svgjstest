import ObjectTree from "./Structures/ObjectTree";

// Abteilung 2
let NodePrinter = node => {
    let tabs = Array.from({length: node.depth}, () => "+--").join("");
    if (node.id === "i_11") return false; // stops traversal if condition fits
    console.log(tabs + node.id);
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
            i111: {
                x: 0, 
                y: 0, 
                w: 400
            },
            i112: "Vogel"
        },
        i12: "i12"
    },
    i2: "i2",
    i3: "i3"
};



function CreateTree(kick) {
    var objTreeTest2 = new ObjectTree(test2);

    var root = { id: "root" };
    var ancestors = [root];

    function createNode(node) {
        let curParent = ancestors[ancestors.length-1];

        if(node.id === kick) {
            // kick it!
        }

        // attach node to parent
        curParent[node.id] = node.data;

        if (node.hasChildren) {
            ancestors.push(node);
        }

        if (!node.hasChildren && node.isLastChild){
            while (ancestors.length > 1 && (ancestors.pop()).isLastChild) {}
        }


        console.log(node.id);
    }

    objTreeTest2.traverse(createNode);
    return root;
}

var tree = CreateTree("i11");
let objTree2 = new ObjectTree(tree);

console.log("\n\n->  root:")
objTree2.traverse(NodePrinter);




if (module.hot) {
  module.hot.accept();
}
