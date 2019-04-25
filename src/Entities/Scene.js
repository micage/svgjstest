const Frame = require("./Frame");
const Entity = require("./IEntity");
const Camera = require("./Camera");

/*
    So what is a Scene?
    - has a list of cameras, one of them is the current camera
    - has a list of entities, stored in a map
*/

/**
 * 
 */
const Scene = function() {
    this.camaras = { current: new Camera() };
    this.entities = {};
    this.root = new Frame({ id: "root"} );
};

Scene.prototype = {
    get camera() {
        return this.camaras.current;
    },

    addEntity(name, ent) {
        this.entities[name] = ent;
    },

    traverse(func) {
        this.root.traverse(func);
    },

    render(R, t){
        R.clear();
        R.setStyle({
            lineWidth: 2,
            fillStyle: "#00ff00",
            strokeStyle: "#005588",
        });
        R.line({x: 0, y: 0}, {x: 400, y: t * 10 + 100});
    }
};

module.exports = Scene;