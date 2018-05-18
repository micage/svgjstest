global.__DEBUG__ = true;

const Scene = require("../../Entities/Scene");
const Frame = require("../../Entities/Frame");
const Vector3 = require("../../Math/Vector3");

let scene = new Scene();

let fr100 = new Frame({
    at: new Vector3(),
    pos: new Vector3(5,10,5),
});

let fr110 = new Frame({
    id: "test",
    at: new Vector3(),
    pos: new Vector3(5,10,5),
});

let fr120 = new Frame({
    id: "kiwi",
    at: new Vector3(),
    pos: new Vector3(5,10,4),
});

fr100.addChild(fr110);
fr100.addChild(fr120);

fr100.forChildren((ch) => {
    console.log(ch.id);
});



const add = (a, b) => console.log(`${a} + ${b} = ${a + b}`);
add(2, 5);

//const myst = (a) => (v => console.log(`${a} + ${v} = ${a + v}`));

const myst = a => v => a + v;

let add7 = myst(7);

let res = add7(8);
add7(3);






