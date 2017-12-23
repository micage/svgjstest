
let mazeData = [
    "UPPPUPPPUP",
    "PUUPPPUUUP",
    "PPPUUUPPPP",
    "UUPPPPPUUP"
];

class Maze {
    constructor(maze) {
        this.nodes = [];

        // Connect horizontally
        for (let iRow = 0; iRow < maze.length; iRow++) {
            let row = maze[iRow];
            for (let iCol = 0; iCol < row.length; iCol++) {
                let field = row[iCol]; 
                if (field == "P") {
                    let node = new Node(iCol, iRow);
                    this.nodes.push(node);
                    while(iCol < row.length - 1 && row[iCol + 1] == "P") {
                        let nextNode = new Node(iCol + 1, iRow);
                        node.addNode(nextNode);
                        nextNode.addNode(node);
                        node = nextNode;
                        iCol++;
                    }
                }                
            }
        }
        
        // Connect nodes vertically
        // for each node find a node with identical px and py+-1 
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            for (let j = 0; j < this.nodes.length; j++) {
                let otherNode = this.nodes[j];
                if (otherNode == node) continue;
                if (otherNode.py == node.py - 1 || otherNode.py == node.py + 1) {
                // if (otherNode.py == node.py + 1) {
                    node.addNode(otherNode);
                    otherNode.addNode(node);
                }
            }            
        }
    }

    getNeighbours(px, py) {
        let nb = [];
        if (py >= this.maze.length || py < 0) {
            return null;
        }
        if (px >= this.maze[0].length || px < 0) {
            return null;
        }
        
        if (py > 0 && maze[py][px] === 'P') nb.push(new Node(px, py));
        let line = this.maze[py];
        if (line[]){}
        
    }
}

class Node {
    constructor(px, py) {
        this.bVisited = false;
        this.px = px;
        this.py = py;
        this.nb = [];
    }
    visit() {
        this.bVisited = true;
    }
    isVisited() {
        return this.bVisited;
    }
    addNode(node) {
        if (!this.nb.find(v => v == node)) {
            this.nb.push(node);
        }
    }
};

class Queue {
    constructor() {
        this.q = [];
    }

    push(node) {
        this.q.push(node);
    }

    pop() {
        let node = this.q[0];
        this.q = this.q.slice(1);
        return node;
    }
};

let theMaze = new Maze(mazeData);
let q = new Queue();

// push first node to the Q.
// 

export default abstand = function(s, t) {
    q.push(theMaze.nodes[0]);

    while (q.length) {
        let node = q.pop();
        
    }

}