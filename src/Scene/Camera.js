const Frame = require("./Frame");
const Vector3 = require("../Math/Vector3");
//import "./typedefs";


let numInstances = 0;


/**
 * @class
 * @implements {ICamera}
 * @param {CameraParams} args
 */
const Camera = function(args) {
    this.name = args.name || "Camera" + numInstances;
    this.dist = args.dist || 10;

    numInstances += 1;
};


/**
 * @param {Vector3} v
 */
Camera.prototype.project = function(v) {
    // v.z should be clipped to <z.near, z.far>
    let s = this.dist / (v.z);
    return new Vector3(v.x * s, v.y * s, 0);
};


/**
 * @param {Vector3} target
 */
Camera.prototype.setTarget = function(target) {
    this.target = target;
};


/**
 * @param {number} t
 * @param {number} dt
 */
Camera.prototype.update = function (frame, t, dt) {
    frame.lookAt(this.target);
};


Camera.prototype.render = function(frame, renderer) {
};

module.exports = Camera;


