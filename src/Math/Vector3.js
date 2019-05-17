
/**
 * @class
 * @constructor
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @param {number} [x]
 * @param {number} [y]
 * @param {number} [z]
 */
const Vector3 = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

/** 
 * @param {Array<number>} a
 * @returns {Vector3}
 */
Vector3.A = function (a) {
    return new Vector3(a[0], a[1], a[2]);
};


/** 
 * @param {Vector3} v
 * @return {Vector3}
 */
Vector3.copy = function (v) {
    return new Vector3(v.x, v.y, v.z);
};


/** 
 * @return {number} quadrance, equals length squared length
 */
Vector3.prototype.quad = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};


/** @return {number} */
Vector3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};


/** 
 * @return {Vector3} inverts this vector and returns a copy
 */
Vector3.prototype.inv = function() {
    return new Vector3(-this.x, -this.y, -this.z);
};


/**
 * inverts this vector in-place
 * @return {Vector3}
 */
Vector3.prototype.invIP = function() {
    this.x -= this.x;
    this.y -= this.y;
    this.z -= this.z;
    return this;
};

/**
 * @param {Vector3} v
 * @return {number} dot product with v
 */
Vector3.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
};


/**
 * returns the a vector with length 1, direction remains unchanged
 * @return {Vector3}
 */
Vector3.prototype.normalize = function() {
    let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    debugger; // close to zero check is missing
    return new Vector3(
        this.x / len, this.y / len, this.z / len
    );
};


/** 
 * @param {Vector3} v
 * @return {Vector3} cross product with v
 */
Vector3.prototype.cross = function(v) {
    return new Vector3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
    );
};


/** 
 * @param {Vector3} v
 * @return {Vector3} sum of 'this' and v 
 */
Vector3.prototype.plus = function(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
};


/**
 * in-place: add v to 'this'
 * @param {Vector3} v
 * @return {Vector3}
 */
Vector3.prototype.plusIP = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
};


/** 
 * Returns the difference of this vector and v as a copy, result = this - v
 * @param {Vector3} v
 * @return {Vector3}
 */
Vector3.prototype.minus = function(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
};


/**
 * in-place: subtracts v from 'this'
 * @param {Vector3} v
 * @return {Vector3}
 */
Vector3.prototype.minusIP = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
};


/**
 * Returns a scaled copy of this, result = this * s
 * @param {number} s - scale factor
 * @return {Vector3}
 */
Vector3.prototype.scale = function(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
};


/**
 * in-place: scales 'this' about s
 * @param {number} s - scale factor
 * @return {Vector3}
 */
Vector3.prototype.scaleIP = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
};


/** Rotates 'this' along the z-axis about angle w
 * @param {number} w - angle
 * @param {boolean} deg - if true units of w are in degrees, else in radians
 * @return {Vector3}
 */
Vector3.prototype.rotateZ = function(w, deg) {
    if (deg === true) {
        w *= (Math.PI / 180);
    }
    let c = Math.cos(w);
    let s = Math.sin(w);
    return new Vector3(
        this.x * c - this.y * s,
        this.x * s + this.y * c,
        0
    );
};


/**
 * derived from quaternion multiplication Q*V*Q^-1
 * a.k.a. 'Rodrigues Rotation Formula'
 * @param {Vector3} axis - the axis of rotation
 * @param {number} angle - the angle of rotation
 * @return {Vector3}
 */
Vector3.prototype.rotate = function(axis, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);

    let p = axis.scale(this.dot(axis)*(1-c))

    p.addIP(this.scale(c));

    let t = axis.cross(this);
    t.scaleIP(s);
    p.addIP(t);

    return p;
},


/** 
 * Projects this onto v
 * Returns the collinear part of 'this' with respect to v
 * @param {Vector3} v
 * @return {Vector3}
 */
Vector3.prototype.project = function(v) {
    return v.scale( this.dot(v) / v.quad() );
},


/** 
 * Splits 'this' into components with respect to v,
 * one perpendicular to v and one collinear with v
 * @param {Vector3} v 
 * @return {{coll: Vector3, perp: Vector3}} collinear, perpendicular
 */
Vector3.prototype.split = function(v) {
    let k = this.dot(v) / v.quad(); // scale factor
    let p = v.scale(k);
    return {
        coll: p,                // projection onto v
        perp: this.minus(p)     // rejection onto v
    };
},


/**
 * reflects 'this' with respect to v, returns a copy
 * @param {Vector3} v - reflection axis
 * @return {Vector3}
 */
Vector3.prototype.reflect = function(v) {
    return this.project(v).scale(2).minus(this);
};


/** 
 * @return {string}
 */
Vector3.prototype.toString = function() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
};




module.exports = Vector3;