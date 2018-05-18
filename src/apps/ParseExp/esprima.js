global.__DEBUG__ = !!1;

const esprima = require('esprima');
const ObjectTree = require('../../Structures/ObjectTree');

let script = "var res = -(b * -a)/ (A - -1.2n)";

let ast = esprima.parseScript(script);

console.log(ast, "\n");


let tree = new ObjectTree("esprima", ast);
tree.traverse(ObjectTree.Printer);