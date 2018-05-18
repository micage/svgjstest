const Vector2 = require("./Vector2");

const Matrix2x2 = function(m) {
    m = m || [1, 0, 0, 1];
    this._11 = m[0]; this._12 = m[1];
    this._21 = m[2]; this._22 = m[3];
};

Matrix2x2.prototype = {
    plus(b) {
        return new Matrix2x2([
            this._11 + b._11,
            this._12 + b._12,
            this._21 + b._21,
            this._22 + b._22
        ]);
    },

    mul(m) {
        return new Matrix2x2([
            this._11 * m._11 + this._12 * m._21, // row1 * col1
            this._11 * m._12 + this._12 * m._22, // row1 * col2
            this._21 * m._11 + this._22 * m._21, // row2 * col1
            this._21 * m._12 + this._22 * m._22, // row2 * col2
        ]);
    },

    mulv(v) {
        return new Vector2(
            this._11 * v.x + this._12 * v.y,
            this._21 * v.x + this._22 * v.y
        );
    },

    inverse() {
        let det = this._11 * this._22 - this._12 * this._21;
        return new Matrix2x2([
            det * this._22,
            -det * this._12,
            -det * this._21,
            det * this._11
        ]);
    },

    transpose() {
        return new Matrix2x2([
            this._11, this._21,
            this._12, this._22
        ]);
    },

    scale(s) {
        return new Matrix2x2([
            this._11 * s, this._12 * s,
            this._21 * s, this._22 * s
        ]);
    },

    rotate() {
        let c = Math.cos(.5);
        let s = Math.sin(.5);
        return new Matrix2x2([c, s, -s, c]);
    },
    
    toString() {
        return `${this._11} ${this._12}\n ${this._21} ${this._22}`;
    }
};

module.exports = Matrix2x2;
