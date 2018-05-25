/**
 *  This is just a test for generating a tree from another
 */

global.__DEBUG__ = true; 

const Frame2D = require("./Frame2D.js");
const ObjectTree = require("../Structures/ObjectTree");
const { ReplicateTree } = require("../Structures/ReplicateTree");

let fr000 = new Frame2D({ name: "fr000" });
let fr001 = new Frame2D({ name: "fr001" });
let fr002 = new Frame2D({ name: "fr002" });
let fr011 = new Frame2D({ name: "fr011" });

fr000.addChild(fr001);
fr000.addChild(fr002);
fr001.addChild(fr011);

console.log("Just some functionality test on the Frame2D class", fr000.toString());

fr000.traverse((f) => {
    console.log(f.name);
});


let tree = {
    "000": {
        "001": {
            "011": { x: 11, y: 5 },
            "012": { x: 12, y: 7 }
        },
        "002": {
            "021": { x: 21 },
            "022": { x: 22 },
            "023": {
                "0231": { x: 231 },
                "0232": { x: 232 },
            }
        },
        "003": { x: 3 }
    }
};

let f000 = ReplicateTree({
    createNode: (parent, info) => {
        let frame;
        if (parent && info) {
            if (info.hasChildren) {
                frame = new Frame2D(info.data);
                frame.name = info.id;
                parent.addChild(frame);
            }
        }
        else {
            frame = new Frame2D({ name: "root" });
        }
        return frame;
    },
    container: new ObjectTree("root", tree["000"])
});

console.log("==== traversal ====");
f000.traverse((f) => {
    console.log(f.name);
});


/**
 * the desired result has been achieved
 * i created a tree from a totally different one
 * The 1st was a JSON-Tree, the second a Frame2D-Tree
 */