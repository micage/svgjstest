const Vector3 = require("../Math/Vector3");

let numInstances = 0;

/** A frame of reference to which coordinates of vertices are related
 * @class
 * @constructor
 * @param {Object} params contructor data
 *   - {Date} t0 - start of lifetime
 *   - {Date} t1 - end of lifetime
 *   - {Frame} parent - the parent frame of this
 *   - {array<Frame>} children - the child frames of this
 *   - {Vector3} at - the position the e3-axis is pointing to
 *   - {Vector3} e1
 *   - {Vector3} e2
 *   - {Vector3} e3 - orthogonal unit vectors that constitutes a basis
 *   - {Entity} entity - providing geometry 
 */
const Frame = function(params) {
    params = params || {};
    if (__DEBUG__) {
        if(!params) {
            console.warn("No Frame params specified.")
        }
    }
    this.id = params.id || ("#" + numInstances);

    this.t0 = 0;
    this.t1 = 0;

    this.parent = params.parent || null;
    this.children = {};

    // position and orientation with respect to the parent frame
    this.pos = params.pos || new Vector3();
    this.e1 = new Vector3(1, 0, 0);
    this.e2 = new Vector3(0, 1, 0);
    this.e3 = new Vector3(0, 0, 1);

    this.entities = {};

    numInstances++;
};

Frame.prototype = {
    moveTo(v) {
        this.pos.addIP(v);
    },

    toFrame(v) {
        let d = v.minus(this.pos); // d = T inverse times v
        return new Vector3( // R transpose times d
            this.e1.dot(d),
            this.e2.dot(d),
            this.e3.dot(d)
        );
    },

    // in place op
    lookAt(pos) {
        this.e3 = pos.minus(this.pos).norm(); // distance vector
        this.e1 = new Vector3(this.e3.z, 0, -this.e3.x).norm();
        this.e2 = this.e3.cross(this.e1);
    },

    addEntity(ent) {
        this.entities[ent.name] = ent;
    },

    /**
     * 
     * @param {Frame} fr 
     */
    addChild(fr) {
        fr.parent = this;
        this.children[fr.id] = fr;
    },

    /**
     * @param {{(f:Frame) => void}} func 
     */
    forChildren(func) {
        for (let v of Object.values(this.children)) {
            func(v);
        }
        // for (let i of Object.keys(this.children)) {
        //     fun(this.children[i]);
        // }
    },

    traverse(func, order) {
        if (order === "post") this._postOrder(func);
        else this._postOrder(func);
    },

    _postOrder(func) {
        for (let v of Object.values(this.children)) {
            this._postOrder(func);
        }
        func(v);
    }
};


module.exports = Frame;