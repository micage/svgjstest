


const Node = function(str) {
    this.parent = null;
    this.children = [];
    this.name = str;

};

// Node.prototype.toString = () => this.name;
Node.prototype.toString = function()  {
    return this.name;
};

// Node.prototype.numChildren = function() {
//     return this.children.length;
// }

// Node.prototype.isLastChild = function () {
//     if (this.parent) {
//         return this.parent.children[this.parent.children.length - 1] == this ? true : false;
//     }
//     return true;
// }

Object.defineProperty(Node.prototype, "numChildren", {
    get: function numChildren() {
        return this.children.length;
    }
});

Object.defineProperty(Node.prototype, "isLastChild", {
    get: function isLastChild() {
        if (this.parent) {
            return this.parent.children[this.parent.children.length - 1] === this;
        }
        // else it's a root node and per definition last and only child
        return true;
    }
});

Node.prototype.addChild = function(node) {
    this.children.push(node);
    node.parent = this;
};

/**
 * breadth (level) first traversal, non-recursive
 * @param {Function} it - iterator function which takes the current node
 */
Node.prototype.level = function (it) {
    let st = [this];
    while (st.length) {
        let node = st[0];
        st = st.slice(1);
        node.children.forEach(child => {
            st.push(child);
        });
        it(node);
    }
};

Node.prototype.preorder = function(it) {
    it(this);
    this.children.forEach(child => {
        child.preorder(it);
    });
};

Node.prototype.inorder = function(it) {
    this.children.forEach(child => {
        child.inorder(it);
        it(this);
    });
};

Node.prototype.postorder = function(it) {
    this.children.forEach(child => {
        child.postorder(it);
    });
    it(this);
};


/********************************************************
 * 
 *      Test
 * 
*/
let node1 = new Node("1");
    let node11 = new Node("11");
        let node111 = new Node("111");
        let node112 = new Node("112");
    let node12 = new Node("12");
        let node121 = new Node("121");
        let node122 = new Node("122");
            let node1221 = new Node("1221");
    let node13 = new Node("13");
    
node1.addChild(node11);
    node11.addChild(node111);
    node11.addChild(node112);
node1.addChild(node12);
    node12.addChild(node121);
    node12.addChild(node122);
        node122.addChild(node1221);
node1.addChild(node13);

let out = [];
node1.level((node) => {
    out.push(`<${node.name}${node.numChildren ? "+" : "-"}${node.isLastChild ? "!" : "."}>`);
});
console.log('level: ' + out.join(" "), "\n");

out = [];
node1.preorder((node) => {
    out.push(`<${node.name}${node.numChildren ? "+" : "-"}${node.isLastChild ? "!" : "."}>`);
});
console.log('preorder: ' + out.join(" "), "\n");

out = [];
node1.postorder((node) => {
    out.push(`<${node.name}${node.numChildren?"+":"-"}${node.isLastChild ? "!" : "."}>`);
});
console.log('postorder: ' + out.join(" "));

