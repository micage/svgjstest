const Vector3 = require("../Math/Vector3");
import "./typedefs"

/** @typedef {typeof import("../Renderer/IRenderer")} IRenderer */

/**
 * @type {Object<string, InterPolType>}
 */
const InterPolEnum = {
    LINEAR: { id: 0, name: "LINEAR" }, 
    CUBIC: { id: 1, name: "CUBIC" }, 
    BICUBIC: { id: 2, name: "BICUBIC" }
};
Object.freeze(InterPolEnum);


//========================================================================


let numPathes = 0;

/**
 * @param {PathParams} args
 */
const Path = function(args) {
    this._name = args.name || ("" + numPathes);
    this._frame = null;
    this._vertices = args.vertices || [];
    this._style = args.style || "default";
    this.isClosed = args.isClosed === true ? true : false; 
};

Path.prototype.getName = function() { return this._name; };
Path.prototype.getFrame = function() { return this._frame; },
Path.prototype.getNumVertices = function() { return this._vertices.length; },
Path.prototype.getVertex = function(i) { return this._vertices[i]; };

Path.prototype.setVertexPosition = function(i, x, y, z) {
    this._vertices[i].pos.x = x;
    this._vertices[i].pos.y = y;
    this._vertices[i].pos.z = z;
},

/**
 * @param {Vertex} vertex
 */
Path.prototype.addVertex = function(vertex) {
    this._vertices.push(vertex);
},

/**
 * @param {number} t
 * @param {number} dt
 */
Path.prototype.update = function(t, dt) {
};

/**
 * @param {IRenderer} renderer
 */
Path.prototype.render = function(renderer) {
    renderer.setStyle(this._style);
    renderer.path(this._vertices);        
};


export { Path };
// module.exports = { Path };