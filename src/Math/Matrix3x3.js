const Vector3 = require("./Vector3");

const Matrix3x3 = function(m) {
    m = m || [1, 0, 0, 0, 1, 0, 0, 0, 1]; // 3 column vectors
    this._11 = m[0]; this._12 = m[1]; this._13 = m[2];
    this._21 = m[3]; this._22 = m[4]; this._23 = m[5];
    this._31 = m[6]; this._32 = m[7]; this._33 = m[8];
}

Matrix3x3.prototype = {
    det() {
        return this._11 * (this._22 * this._33 - this._23 * this._32)
             - this._12 * (this._21 * this._33 - this._23 * this._31)
             + this._13 * (this._21 * this._32 - this._22 * this._31);
    },

    mul(m) {
        return new Matrix3x3([
            this._11 * m._11 + this._12 * m._21 + this._13 * m._31, 
            this._11 * m._12 + this._12 * m._22 + this._13 * m._32, 
            this._11 * m._13 + this._12 * m._23 + this._13 * m._33,

            this._21 * m._11 + this._22 * m._21 + this._23 * m._31,
            this._21 * m._12 + this._22 * m._22 + this._23 * m._32,
            this._21 * m._13 + this._22 * m._23 + this._23 * m._33,

            this._31 * m._11 + this._32 * m._21 + this._33 * m._31,
            this._31 * m._12 + this._32 * m._22 + this._33 * m._32,
            this._31 * m._13 + this._32 * m._23 + this._33 * m._33
        ]); 
    },

    plus(m) {
        return new Matrix3x3([
            this._11 + m._11, this._12 + m._12, this._13 + m._13,
            this._21 + m._21, this._22 + m._22, this._23 + m._23,
            this._31 + m._31, this._32 + m._32, this._33 + m._33,
        ]); 
    },

    plusIP(m) {
        this._11 += m._11; this._12 += m._12; this._13 += m._13;
        this._21 += m._21; this._22 += m._22; this._23 += m._23;
        this._31 += m._31; this._32 += m._32; this._33 += m._33;
        return this;
    },

    mulv(v) {
        return new Vector3(
            this._11 * v.x + this._12 * v.y + this._13 * v.z,
            this._21 * v.x + this._22 * v.y + this._23 * v.z,
            this._31 * v.x + this._32 * v.y + this._33 * v.z
        );
    },

    scale(s) {
        return new Matrix3x3([
            this._11 * s, this._12 * s, this._13 * s,
            this._21 * s, this._22 * s, this._23 * s,
            this._31 * s, this._32 * s, this._33 * s,
        ]); 
    },

    scaleIP(s) {
        this._11 *= s; this._12 *= s; this._13 *= s;
        this._21 *= s; this._22 *= s; this._23 *= s;
        this._31 *= s; this._32 *= s; this._33 *= s;
        return this;
    },

    transpose() {
        return new Matrix3x3([
            this._11, this._21, this._31,
            this._12, this._22, this._32,
            this._13, this._23, this._33
        ]);
    },

    adj() {
        let d = 1;
        return new Matrix3x3([
            d * (this._22 * this._33 - this._23 * this._32), // R
           -d * (this._21 * this._33 - this._23 * this._31), // -S
            d * (this._21 * this._32 - this._22 * this._31), // T

           -d * (this._12 * this._33 - this._13 * this._32), // -U
            d * (this._11 * this._33 - this._13 * this._31), // V
           -d * (this._11 * this._32 - this._12 * this._31), // -W

            d * (this._12 * this._23 - this._13 * this._22), // X
           -d * (this._11 * this._23 - this._13 * this._21), // -Y
            d * (this._11 * this._22 - this._12 * this._21), // Z
       ]);
   },

    inverse() {
        let D = this.det();
        if (D * D < 1e-15) {
            console.warn("Matrix has no inverse. Det = 0");
            return new Matrix3x3([NaN,NaN,NaN, NaN,NaN,NaN, NaN,NaN,NaN]);
        }
        let d = 1/D;
        return new Matrix3x3([
             d * (this._22 * this._33 - this._23 * this._32), // R
            -d * (this._12 * this._33 - this._13 * this._32), // -U
             d * (this._12 * this._23 - this._13 * this._22), // X

            -d * (this._21 * this._33 - this._23 * this._31), // -S
             d * (this._11 * this._33 - this._13 * this._31), // V
            -d * (this._11 * this._23 - this._13 * this._21), // -Y

             d * (this._21 * this._32 - this._22 * this._31), // T
            -d * (this._11 * this._32 - this._12 * this._31), // -W
             d * (this._11 * this._22 - this._12 * this._21), // Z
        ]);
    },

    toArray() {
        return [
            this._11, this._12, this._13,
            this._21, this._22, this._23,
            this._31, this._32, this._33
        ];
    },

    toString() {
        return `${this._11.toFixed(2)} ${this._12.toFixed(2)} ${this._13.toFixed(2)} \n` +
               `${this._21.toFixed(2)} ${this._22.toFixed(2)} ${this._23.toFixed(2)} \n` +
               `${this._31.toFixed(2)} ${this._32.toFixed(2)} ${this._33.toFixed(2)}`;
    }
};

/**
 * Returns an anti-symetric 3x3 Matrix
 * @param {Vector3} v 
 */
Matrix3x3.skew = (v) => new Matrix3x3([
    0, -v.z, v.y,
    v.z, 0, -v.x,
    -v.y, v.x, 0
]);

/**
 * Returns a symetric 3x3 Matrix, M.skew(v) squared
 * @param {Vector3} v 
 */
Matrix3x3.skew2 = (v) => {
    let xy = v.x * v.y;
    let xz = v.x * v.z;
    let yz = v.y * v.z;
    let xx = v.x * v.x;
    let yy = v.y * v.y;
    let zz = v.z * v.z;
    return new Matrix3x3([
        -yy -zz, xy, xz,
        xy, -xx -zz, yz,
        xz, yz, -xx -yy
    ]);
};

Matrix3x3.ByAngleAxis = (w, a) => {
    let sin = Math.sin(w);
    let cos1 = 1 - Math.cos(w); 
    let xy = cos1 * a.x * a.y;
    let xz = cos1 * a.x * a.z;
    let yz = cos1 * a.y * a.z;
    let xx = cos1 * a.x * a.x;
    let yy = cos1 * a.y * a.y;
    let zz = cos1 * a.z * a.z;
    let x = sin * a.x;
    let y = sin * a.y;
    let z = sin * a.z;
    return new Matrix3x3([
        1 - yy - zz, xy - z, xz + y,
        xy + z, 1 - xx - zz, yz - x,
        xz - y, yz + x, 1 - xx - yy
    ]);
};

module.exports = Matrix3x3;