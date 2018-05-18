

const Scalar = function(s) {
    this.s = s;
};




const Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector2.prototype = {
    /** @return {number} quadrance of this */
    quad() {
        return this.x * this.x + this.y * this.y;
    },

    /** @return {number} this in the opposite direciton */
    inv()  {
        return new Vector2(-this.x, -this.y);
    },
    invIP() {
        this.x *= -1, this.y *= -1;
    },

    /** @return {Vector2} a vector perpendicular to this */
    perp() {
        return new Vector2(this.y, -this.x);
    },
    /** @return {number} dot product of this with v */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    },

    /** @return {Vector2} a vector perpendicular to this */
    plus(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    },
    minus(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    },
    plusIP(v) {
        this.x += v.x; this.y += v.y;
        return this;
    },
    minusIP(v) {
        this.x -= v.x; this.y -= v.y;
        return this;
    },

    /** @return {Vector2} */
    scale(s) {
        return new Vector2(this.x * s, this.y * s);
    },
    scaleIP(s) {
        this.x *= s; this.y *= s;
        return this;
    },

    /** @param {number} w - angle */
    /** @param {boolean} deg - if true units of w are degree, else radians */
    /** @return {Vector2} - this vector rotated by angle w */
    rotate(w, deg) {
        if (deg === true) {
            w *= (Math.PI / 180);
        }
        let c = Math.cos(w);
        let s = Math.sin(w);
        return new Vector2(
            this.x * c - this.y * s,
            this.x * s + this.y * c
        );
    },

    /** Splits this into components with respect to v,
     *  one perpendicular to v and one collinear with v
     * @param {Vector2} v 
     * @return {{Vector2}, {Vector2}} a vector perpendicular to this.v
     */
    split(v) {
        let k = this.dot(v) / v.quad();
        let b = v.scale(k);
        return {
            coll: b,
            perp: this.plus(b.inv)
        };
    },

    /**
     * mirrors v with respect to this
     */
    mirror(v) {
        // return v.plus(v.split(this).perp.scale(2).inv());
        let n = this.scale(2 * this.dot(v) / this.quad());
        return n.minus(v);
    },

    /** @return {string}  */
    /** @param {string} name of the vector */
    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

};


module.exports = Vector2;