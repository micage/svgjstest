import ObjectTree from "../../Structures/ObjectTree";
import data from "../../Structures/TreeTestData";
import * as __ from "../../Util/ParamCheck";

let tree = new ObjectTree("test", data);

const print = (node) => {
    let tabs = Array.from({ length: node.depth - 1 }, () => ".  ").join("");

    let str = "";
    if (!__.checkObject(node.data) && !__.checkArray(node.data)) {
        str = ` ${JSON.stringify(node.data)}`;
    }

    console.log(`${tabs}${node.id} <${node.depth}> ${str}`);

    //return true;
};

const findNode = (name) => {
    let foundNode = { id: "not found" };

    const find = (node) => {
        if (node.id === name) {
            foundNode = {
                id: node.id,
                depth: node.depth,
                numChildren: node.numChildren,
                isLast: node.isLastChild,
                data: node.data
            };
            return false; // stop further traversal
        }
    };

    tree.traverse(find);
    return foundNode;
};

if (0) {
    let nodeName = "i12";

    console.log("found node method 1:");
    console.log(findNode(nodeName));

    console.log("found node method 2:");
    console.log(tree.find(nodeName));
}

let ot = tree.getChild("i1");
console.log(ot);

let job = tree.getChild("job");
console.log(job);

let ot2 = tree.getNode("i1/i11/i112");
console.log(ot2);

ot2.setChild("job", job.getObject());
console.log(ot2);
ot2.traverse(print);

// console.log("node, <depth>, data (if no children)");
// tree.traverse(print);


// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
