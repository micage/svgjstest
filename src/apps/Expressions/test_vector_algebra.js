global.__DEBUG__ = true;

//==========================================
const ExpParser = require("../../Math/ExpressionParser");
const Vector2 = require("../../Math/Vector2.js");
const Vector3 = require("../../Math/Vector3.js");
const Matrix2x2 = require("../../Math/Matrix2x2.js");
const Matrix3x3 = require("../../Math/Matrix3x3.js");

let P = new ExpParser({
    constants: {
        "pi": Math.PI,
        "c": Math.cos(Math.PI / 6), // 30°
        "s": Math.sin(Math.PI / 6),
        "c2": Math.cos(Math.PI / 12), // 30°
        "s2": Math.sin(Math.PI / 12),
        "I": new Matrix3x3(),
    },
    functions: {
        "rot": (M, w) => M.rotate(w),
        "sin": w => Math.sin(w),
        "cos": w => Math.cos(w),
        "K": v => Matrix3x3.skew(v),
        "K2": v => Matrix3x3.skew2(v),
    },
    unaryOperators: {
        "-": { fun: a => a.inv(), prec: 3 },
        "!": { fun: a => a.inverse(), prec: 3, assoc: "left" },
        "†": { fun: a => a.transpose(), prec: 4, assoc: "left" },
    },
    binaryOperators: {
        "+": {
            fun: (a, b) => {
                if (   ((a instanceof Vector2) && (b instanceof Vector2))
                    || ((a instanceof Vector3) && (b instanceof Vector3))
                    || ((a instanceof Matrix2x2) && (b instanceof Matrix2x2))
                    || ((a instanceof Matrix3x3) && (b instanceof Matrix3x3))
                ) {
                    return a.plus(b);
                }
                else if (typeof a === typeof b) {
                    return a + b;
                }
                else {
                    return NaN;
                }
            }, prec: 2, assoc: "left"
        },
        "-": {
            fun: (a, b) => {
                if ((a instanceof Vector2 && b instanceof Vector2)
                    || (a instanceof Vector3 && b instanceof Vector3)
                    || (a instanceof Matrix2x2 && b instanceof Matrix2x2)
                ) {
                    return a.minus(b);
                }
                else if (typeof a === typeof b) {
                    return a - b;
                }
                else {
                    return NaN;
                }
            }, prec: 2, assoc: "left"
        },
        "*": { fun: (a, b) => {
            if (a instanceof Vector2 || a instanceof Vector3) {
                if (typeof b === 'number') {
                    return a.scale(b);
                }
                else {
                    return NaN;
                }
            }
            else if (a instanceof Matrix2x2) {
                if (b instanceof Matrix2x2) return a.mul(b);
                else if (b instanceof Vector2) return a.mulv(b);
                else return a.scale(b)
            }
            else if (a instanceof Matrix3x3) {
                if (b instanceof Matrix3x3) return a.mul(b);
                else if (b instanceof Vector3) return a.mulv(b);
                else return a.scale(b)
            }
            else { // presume it's a number
                if (typeof b === 'number') return a * b;
                else return b.scale(a);
            }
        }, prec: 3, assoc: "left" },
        "/": { fun: (a, b) => a / b, prec: 3, assoc: "left" },
        // "^": { fun: (a, b) => Math.pow(b, a), prec: 4, assoc: "right" },
        "•": { fun: (a, b) => a.dot(b), prec: 4, assoc: "left" }, // alt-Ü
        "×": { fun: (a, b) => a.cross(b), prec: 4, assoc: "left" }, // alt-k
        "|": { fun: (a, b) => a.mirror(b), prec: 2, assoc: "left" },
    }
});

// let exp = P.createExpression('(A•B/B•B)*B');
// let exp = P.createExpression('A|B|A');
// let f = exp.solve();

// let A = new Vector2(0, 1);
// let B = new Vector2(-1, 1);
// let c = Math.cos(.5);
// let s = Math.sin(.5);
// let M = new Matrix2x2([c, s, -s, c]);
// console.log(f(A, B).toString(), "\n");

let args = { ax: Vector3(1, 1, 1).norm(), b: Vector3(2, 1, 3) };

// =====================================================================
((P, args) => {
    let rod1 = P.createExpression('c * b');
    let rod2 = P.createExpression('s * (ax × b)');
    let rod12 = P.createExpression('c * b + s * (ax × b)');
    let rod3 = P.createExpression('(1 - c) * (ax • b) * ax');
    let rod123 = P.createExpression('c * b + s * (ax × b) + (1 - c) * (ax • b) * ax');
    let rodrigues1 = rod1.solve();
    let rodrigues2 = rod2.solve();
    let rodrigues12 = rod12.solve();
    let rodrigues3 = rod3.solve();
    let rodrigues123 = rod123.solve();
    
    console.log("rod1: ", rodrigues1(args).toString() );
    console.log("rod2: ", rodrigues2(args).toString() );
    console.log("rod3: ", rodrigues3(args).toString() );
    console.log("rod1 + rod2: ", rodrigues12(args).toString() );
    console.log("sum rod1-3: ",  rodrigues123(args).toString() );

    // let rod21 = P.createExpression('2a ∆ (a ∆ b + c * b) + b').solve();
    let rod21 = P.createExpression('s2 * 2ax × (c2 * b + s2 * ax × b) + b');
    // let rod21 = P.createExpression('s2 * 2a');
    let rodrigues21 = rod21.solve();
    console.log("rod21: ", rodrigues21(args).toString(), "\n");

})(P, args);

// =====================================================================
((a, b) => {
    let R = Matrix3x3.ByAngleAxis(Math.PI / 6, a);
    console.log(R.toString());
    console.log("v = " + R.mulv(b).toString());
    console.log("det(R) = ", R.det());
    console.log("len(a) = ", a.length());
    console.log("len(b) = ", b.length());
    console.log("len R * b = ", R.mulv(b).length());
    
    let I = new Matrix3x3();
    console.log("I = ", I.toString());
    console.log("det(I) = ", I.det());
    console.log("len(I * b) = ", I.mulv(b).length(), "\n");
})(args.ax, args.b);

((Parser, a, b) => {
    let now = Date.now();

    for (let i = 0; i < 1000; i++) {
        let f = Parser.createExpression('c * b + s * (a × b) + (1 - c) * (a • b) * a').solve();
        let t = f({ a, b });
        f = t;
    }

    console.log("Formula 1: dt = ", (Date.now() - now), "\n");
})(P, Vector3(1, 1, 1).norm(), Vector3(2, 1, 3));

((I) => {
    let now = Date.now();

    for (let i = 0; i < 1000; i++) {
        let f = I.P.createExpression(I.exp).solve();
        let t = f(I);
        f = t;
    }

    console.log("Formula 2: dt = ", (Date.now() - now), "\n");
})({
    P, 
    exp: 's2 * 2a × (c2 * b + s2 * a × b) + b', 
    a: Vector3(1, 1, 1).norm(), 
    b: Vector3(2, 1, 3)
});

((v) => {
    let now = Date.now();

    for (let i = 0; i < 1000; i++) {
        let R = Matrix3x3.ByAngleAxis(Math.PI / 6, v);
        let t = R.mulv(v)
        v = t;
    }

    console.log("Coded dt = ", (Date.now() - now), "\n");
})(args.b);

