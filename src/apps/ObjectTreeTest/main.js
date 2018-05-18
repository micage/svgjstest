// import ObjectTree from "../../Structures/ObjectTree";
// import data from "../../Structures/TreeTestData";
// import * as __ from "../../Util/ParamCheck";

global.__DEBUG__ = true;
const ObjectTree = require("../../Structures/ObjectTree");
const data = require("../../Structures/TreeTestData");
const __ = require("../../Util/ParamCheck");


const print = (node) => {
    let tabs = Array.from({ length: node.depth - 1 }, () => ".  ").join("");

    let str = "";
    if (!__.checkObject(node.data) && !__.checkArray(node.data)) {
        str = `${JSON.stringify(node.data)}`;
    }

    console.log(`${tabs}${node.id}: ${str}`);

    //return true;
};

const findNode = (name) => {
    let foundNode = null;

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



let tree = new ObjectTree("junk", data.junk);

//==========================================
console.log('---- tree.getChild("job") ----');
tree.getChild("i1").traverse(print);
console.log('\n');

//==========================================
console.log('---- node.setChild ----');
let i112 = tree.getNode("i1/i11/i112");
i112.setChild("jungle", {
    ich: "Tarzan",
    du: "Jane"
});
i112.traverse(print);
console.log('');

//==========================================
console.log('---- tree.deleteChild("i1") ----');
tree.deleteChild("i1");
tree.traverse(print);
console.log('');

//==========================================
console.log(`tree.key: ${tree.key}\n`);

//==========================================
console.log(`---- ${i112.key}.setChild("x", Math.PI)`);
i112.setChild("x", Math.PI);
i112.traverse(print);
console.log('');


// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
