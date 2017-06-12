class Vector2 {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    get x() { return this._x; }
    get y() { return this._y; }

    /** @return {number} quadrance of this */
    get quad() {
        return this._x * this._x + this._y * this._y;
    }

    /** @return {number} this in the opposite direciton */
    get inv() {
        return new Vector2(-this._x, -this._y);
    }

    /** @return {Vector2} a vector perpendicular to this */
    get perp() {
        return new Vector2(this._y, -this._x);
    }

    /** @return {number} dot product of this with v */
    dot(v) {
        return this._x * v._x + this._y * v._y;
    }

    /** @return {Vector2} a vector perpendicular to this */
    translate(v) {
        return new Vector2(this._x + v._x, this._y + v._y);
    }

    /** @return {Vector2} */
    scale(s) {
        return new Vector2(this._x * s, this._y * s);
    }

    /** @param {number} w - angle */
    /** @param {boolean} deg - if true units of w are degree, else radians */
    /** @return {Vector2} - this rotated by angle w */
    rotate(w, deg) {
        if (deg === true) {
            w *= (Math.PI / 180);
        }
        let c = Math.cos(w);
        let s = Math.sin(w);
        return new Vector2(
            this._x * c - this._y * s,
            this._x * s + this._y * c
        );
    }

    /** Splits this into components with respect to v,
     *  one perpedicular to v and one collinear with v
     * @param {Vector2} v 
     * @return {{Vector2}, {Vector2}} a vector perpendicular to this.v
     */
    split(v) {
        let k = this.dot(v) / v.dot(v);
        let b = v.scale(k);
        return {
            coll: b,
            perp: this.translate(b.inv)
        };
    }

    /**
     * mirrors v with respect to this
     */
    mirror(v) {
        return v.translate(v.split(this).perp.scale(2).inv);
    }

    /** @return {string}  */
    /** @param {string} name of the vector */
    toString(v_name) {
        return `${v_name} = (${this._x.toFixed(2)}, ${this._y.toFixed(2)})`;
    }
}

export default Vector2;