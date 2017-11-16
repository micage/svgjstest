class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /** 
     * @return {number} quadrance, equals length squared of 'this'
     */
    get quad() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /** @return {Vector3} this in the opposite direciton */
    get inv() {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    /**
     * inverts 'this' in-place
     */
    invIP() {
        this.x-=this.x;
        this.y-=this.y;
        this.z-=this.z;
    }

    /** @return {number} dot product of 'this' with v */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /** @return {Vector3} cross product of 'this' with v */
    cross(v) {
        return new Vector3(
            this.y * v.z  - this.z * v.y,
            this.z * v.x  - this.x * v.z,
            this.x * v.y  - this.y * v.x
        );
    }

    /** @return {Vector3} sum of 'this' and v */
    plus(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     * in-place: add v to 'this'
     */
    plusIP(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    /** @return {Vector3} difference of 'this' and v */
    minus(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * in-place: subtracts v from 'this'
     */
    minusIP(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    /** @return {Vector3} same direction but different length */
    scale(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    /**
     * in-place: scales 'this' about s
     */
    scaleIP(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    /** Rotates 'this' along the z-axis about angle w
     * @param {number} w - angle
     * @param {boolean} deg - if true units of w are in degrees, else in radians
     * @return {Vector3} - this rotated about angle w along z = (0, 0, 1)
     */
    rotateZ(w, deg) {
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
    }

    /**
     * derived from quaternion multiplication Q*V*Q^-1
     * aka 'Rodriguez Formula'
     * @param {Vector3} axis - the axis of rotation
     * @param {number} angle - the angle of rotation
     */
    rotate(axis, angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let p = axis.scale(this.dot(axis)*(1-c))

        p.addIP(this.scale(c));

        let t = axis.cross(this);
        t.scaleIP(s);
        p.addIP(t);

        return p;
    }

    /** @return {Vector3} the collinear part of 'this' with respect to v
     * @param {Vector3} v
     */
    project(v) {
        return v.scale( this.dot(v) / v.quad );
    }

    /** 
     * Splits 'this' into components with respect to v,
     * one perpendicular to v and one collinear with v
     * @param {Vector3} v 
     * @return {{Vector3}, {Vector3}} collinear, perpendicular
     */
    split(v) {
        let k = this.dot(v) / v.quad; // scale factor
        let p = v.scale(k);
        return {
            coll: p,                // projection onto v
            perp: this.minus(p)     // rejection onto v
        };
    }

    /**
     * reflects 'this' with respect to v
     * invert this and add twice the projection of 'this' onto v
     * @param {Vector3} v - reflection axis
     * @return {Vector3} reflected
     */
    reflect(v) {
        return this.project(v).scale(2).minus(this);
    }

    /** 
     * @param {string} vname - name of the vector
     * @return {string}
     */
    toString(vname) {
        return `${vname} = (${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }
}

export default Vector3;