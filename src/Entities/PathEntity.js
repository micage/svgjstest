const IEntity = require("./IEntity");
const Frame = require("./Frame");
const Vector3 = require("../Math/Vector3");

const Vertex = function(args) {
    this.type = args.type || "linear";
    this.pos = args.pos || new Vector3();
    this.t0 = args.t0 || new Vector3();
    this.t1 = args.t1 || new Vector3();
};
Vertex.prototype = {
    clone() {
        return new Vertex({
            pos: new Vector3(this.pos.x, this.pos.y, this.pos.z),
            t0: new Vector3(this.t0.x, this.t0.y, this.t0.z),
            t1: new Vector3(this.t1.x, this.t1.y, this.t1.z),
            type: this.type
        });
    }
};

const PathEntity = function(args) {
    this._frame = new Frame();
    this._vertices = args.vertices || [];
    this.style = args.style || {
        stroke: "#00ffff",
        strokeWidth: 1
    }
    this.isClosed = args.isClosed === true ? true : false; 
};

PathEntity.prototype = {
    init() {},
    update(t, dt) {},
    destroy() {},

    get frame() { return this._frame; },
    get geometry() {
        return { 
            path: this._vertices, 
            style: this.style
        };
    },
    get length() { return this._vertices.length; },
    getVertex(i) { return this._vertices[i]; },
    setVertexPosition(i, x, y, z) {
        this._vertices[i].pos.x = x;
        this._vertices[i].pos.y = y;
        this._vertices[i].pos.z = z;
    },

    addVertex(v) {
        this._vertices.push(v);
    },
};
PathEntity.prototype.constructor = PathEntity;

module.exports = { PathEntity, Vertex };