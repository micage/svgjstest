import ObjectTree from "../../Structures/ObjectTree";
import data from "../../Structures/TreeTestData";
import * as __ from "../../Util/ParamCheck";

let tree = new ObjectTree(data);

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

console.log("node, <depth>, data (if no children)");
tree.traverse(print);
let nodeName = "i2";

console.log("found node method 1:");
console.log(findNode(nodeName));

console.log("found node method 2:");
console.log(tree.find(nodeName));




// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
