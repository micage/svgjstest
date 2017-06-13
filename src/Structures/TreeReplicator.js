if (__DEBUG__) {
    import ObjectTree from "./Structures/ObjectTree";

    /**
     * @param {Object} parent - tree2 node
     * @param {Object} node - tree1 node
     * @return {Object} - tree2 node
     */
    function createNode(parent, node) {
        // 'parent' is just an object here, so we just add a key and set its value.
        // This has not always to be the case.
        // 'parent' could also be any arbitrary class that is able to 
        // create and add a child node.

        parent[node.id] = node.hasChildren ? {} : node.data

        return parent[node.id];
    }

}


export default
function ReplicateTree(args) {

    if (__DEBUG__) {
        if (typeof args.traverse !== "function") {
            return console.error("ReplicateTree: no traverse function provided.")
        }
        if (typeof args.createNode !== "function") {
            return console.error("ReplicateTree: no createNode function provided.")
        }
        console.log("\n\nOriginal Tree: ")
        objTreeTest2.traverse(NodePrinter); // original tree
        console.log('\nskipped nodes:');
    }

    var root = {}; // of new tree
    var ancestors = [{ node: root, isLast: true }];
    var skipAncestors = [];
    var skipMode = false;

    function skipNode(node) {

        if (__DEBUG__) console.log(node.id + ': ' + JSON.stringify(node.data));

        if (node.hasChildren) {
            skipAncestors.push(node);
        }
        else if (node.isLastChild) {
            while (skipAncestors.length && (skipAncestors.pop()).isLastChild) { }
            while (ancestors.length > 1 && (ancestors.pop()).isLast) { }
        }
        if (!skipAncestors.length) {
            skipMode = false;
        }
    }

    // visits traversable
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

        let currentParent = ancestors[ancestors.length - 1].node;

        // attach node to parent
        let child = args.createNode(currentParent, node);

        if (node.hasChildren) {
            ancestors.push({
                node: child, // this will be parent on the next call
                isLast: node.isLastChild
            });
        }
        else if (node.isLastChild) {
            while (ancestors.length > 1 && (ancestors.pop()).isLast) { }
        }
    }

    args.traversable.traverse(onNode);

    if (__DEBUG__) {
        console.log("\n\nReplicated Tree:");
        let tree2 = new ObjectTree(root);
        tree2.traverse(NodePrinter);
    }

    return root;
}

