const Frame = require("./Frame");
const { Path } = require("./Path");
const Camera = require("./Camera");
// const Vector3 = require("../Math/Vector3");

/*
    So what is a Scene?
    - has a list of cameras, one of them is the current camera
    - has a list of entities, stored in a map

    The scene has to manage the frame tree. Like in a real file system
    therer is a current file path. Default it is the root frame.
    - mkdir -> createFrame("frame1")
    - cd -> setCurrentFrame("/frame1")
    - pwd -> getCurrentFrame()



    IMPLEMENT the tree navigation!




*/

/** @type {Frame} */
let fff;

/**
 * 
 */
const Scene = function() {
    this.camaras = {
        default: new Camera({
            name: "default"
        }),
        current: null
    };
    this.root = new Frame({ name: "/" });
};


/**
 * @param {string} [name]
 * @return {Camera}
 */
Scene.prototype.getCamera = function(name) {
    if (!name) name = "default";
    let cam = this.camaras[name];
    if(!cam) {
        cam = this.camaras.default;
    }
    return cam;
};

Scene.prototype.addEntity = function(name, ent) {
    debugger;
    ent._frame = this.root; // mica: good?
};


/**
 * @param {number} t
 * @param {number} dt
 */
Scene.prototype.update = function(t, dt) {
    debugger;
};


/**
 * @param {PathParams} args
 */
Scene.prototype.createPath = function(args) {
    let p = new Path(args);
    return p;
};


Scene.prototype.newFrame = function() {
    debugger;
    this.root;
},

/**
 * @param {IRenderer} renderer
 */
Scene.prototype.render = function(renderer) {
    renderer.clear();

    // traverse the frame tree
    this.root.traverse((frame) => {
        for (const entKey in frame.entities) {
            const entity = frame.entities[entKey];
            console.log("entity.name = " + entity.name + " is rendering.");

            entity.render(renderer);
        }
    }, "");
};

module.exports = Scene;