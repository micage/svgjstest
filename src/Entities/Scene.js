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

    addEntity(ent) {
        this.entities[ent.name] = ent;
    },

    traverse(func) {
        this.root.traverse(func);
    },

};

module.exports = Scene;