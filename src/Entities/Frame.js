import Vector3 from "../Math/Vector3";

Vector3.prototype.normalize = function() {
    return this.scale(1 / Math.sqrt(this.quad));
}

/** A frame of reference to which coordinates of vertices are related
 * @param {Object} Frame contructor data
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
class Frame {
    constructor(params) {
        if (__DEBUG__) {
            if(!params) {
                params = {};
                console.warn("No Frame params specified.")
            }
        }
        this.t0 = 0;
        this.t1 = 0;
        this.parent = params.parent || null;
        this.children = [];
        this.pos = params.pos || new Vector3();
        this.at = params.at || null;
        this.e1 = new Vector3(1, 0, 0);
        this.e2 = new Vector3(0, 1, 0);
        this.e3 = new Vector3(0, 0, 1);
        if (params.at) this.lookAt(params.at);
        this.entity = params.entity || null;
    }

    moveTo(v) {
        this.pos.addIP(v);
    }

    toFrame(v) {
        let d = v.minus(this.pos); // d = T inverse times v
        return new Vector3( // R transpose times d
            this.e1.dot(d),
            this.e2.dot(d),
            this.e3.dot(d)
        );
    }

    // in place op
    lookAt(pos) {
        this.e3 = pos.minus(this.pos).normalize(); // distance vector
        this.e1 = new Vector3(this.e3.z, 0, -this.e3.x).normalize();
        this.e2 = this.e3.cross(this.e1);
    }
}

export default Frame;