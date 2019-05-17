const Vector3 = require("../Math/Vector3");
// import "./typedefs";

let numInstances = 0;


/**
 * @constructor
 * @param {FrameParams} args
 */
const Frame = function(args) {
    this.name = args.name || ("#" + numInstances);
    this.children = {};

    // position and orientation with respect to the parent frame
    this.pos = args.pos || new Vector3();
    this.e1 = new Vector3(1, 0, 0);
    this.e2 = new Vector3(0, 1, 0);
    this.e3 = new Vector3(0, 0, 1);

    this.entities = {};

    numInstances++;
};


/** @param {Vector3} v - translation by v */
Frame.prototype.move = function(v) {
    this.pos.plusIP(v);
};


/** @param {Vector3} v - transforms v into this frames coordinates */
Frame.prototype.toFrame = function(v) {
    let d = v.minus(this.pos); // d = T inverse times v
    return new Vector3( // R transpose times d
        this.e1.dot(d),
        this.e2.dot(d),
        this.e3.dot(d)
    );
};


// in place op
Frame.prototype.lookAt = function(pos) {
    this.e3 = pos.minus(this.pos).norm(); // distance vector
    this.e1 = new Vector3(this.e3.z, 0, -this.e3.x).normalize();
    this.e2 = this.e3.cross(this.e1);
};


/**
 * @param {IEntity} ent
 */
Frame.prototype.addEntity = function(ent) {
    this.entities[ent.getName()] = ent;
};


/**
 * @param {string} name - name of the entity to be removed
 * @return {IEntity|null}
 */
Frame.prototype.removeEntity = function(name) {
    let ent = this.entities[name];
    if (ent) {
        delete this.entities[name];
        return ent;
    }
    return null;
};


/**
 * 
 * @param {Frame} childFrame 
 */
Frame.prototype.addChild = function(childFrame) {
    // childFrame.parent = this;
    this.children[childFrame.name] = childFrame;
};


/**
 * 
 * @param {string} childName
 * @return {Frame|null}
 */
Frame.prototype.removeChild = function(childName) {
    // childFrame.parent = this;
    let childFrame = this.children[childName];
    if (childFrame) {
        childFrame.parent = null;
        delete this.children[childName];
        return childFrame;
    }
    else {
        return null;
    }
};


/**
 * @param {(f:Frame) => void} func
 */
Frame.prototype.forChildren = function(func) {
    for (const frame in this.children) {
        const childFrame = this.children[frame];
        func(childFrame);
    }
};


/**
 * @param {(f: Frame) => void} func
 * @param {string} [order] - pre, in, post
 */
Frame.prototype.traverse = function(func, order) {
    if (order === "post") this._postOrder(func);
    else {
        debugger; // implement the other traversal types
        this._postOrder(func);
    }
};


/**
 * @param {(f: Frame) => void} func
 */
Frame.prototype._postOrder = function(func) {
    func(this);
    // for (let frame of this.children) {
    //     this._postOrder(func);
    //     func(frame);
    // }
    this.forChildren(frame => {
        this._postOrder(func);
        func(frame);
    });
};


module.exports = Frame;