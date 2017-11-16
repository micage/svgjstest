class Node {
    constructor() {
        this.parent = null;
        this.children = [];
    }

    add(node) {
        node.parent = this;
        this.children.push(node);
    }
}

export default Node;