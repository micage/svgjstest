global.__DEBUG__ = true;

//==========================================
const ExpParser = require("../../Math/ExpressionParser");
const Vector3 = require("../../Math/Vector3.js");
const Matrix3x3 = require("../../Math/Matrix3x3.js");

let Parser = new ExpParser({
    constants: {
        "pi": Math.PI,
        "I": new Matrix3x3(),
    },
    functions: {
        "sin": w => Math.sin(w),
        "cos": w => Math.cos(w),
        "K": v => Matrix3x3.skew(v),
        "K2": v => Matrix3x3.skew2(v),
    },
    unaryOperators: {
        "-": { fun: a => a.inv(), prec: 3 },
        "!": { fun: a => a.inverse(), prec: 4 },
        "†": { fun: a => a.transpose(), prec: 4 },
    },
    binaryOperators: {
        "+": {
            fun: (a, b) => {
                if (   ((a instanceof Vector3) && (b instanceof Vector3))
                    || ((a instanceof Matrix3x3) && (b instanceof Matrix3x3))
                ) {
                    return a.plus(b);
                }
                else if (typeof a === typeof b) {
                    return a + b;
                }
                else {
                    console.log("error + op returned NaN")
                    return NaN;
                }
            }, prec: 2, assoc: "left"
        },
        "-": {
            fun: (a, b) => {
                if (   ((a instanceof Vector3) && (b instanceof Vector3))
                    || ((a instanceof Matrix3x3) && (b instanceof Matrix3x3))
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
            if (a instanceof Matrix3x3) {
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

let In = {
    a: Vector3(2, 1, 0).norm(), 
    b: Vector3(1, 1, 0),
    w: Math.PI / 6
};

((In) => {
    let exp = Parser.createExpression('cos(w) * b + sin(w) * (a × b) + (1 - cos(w)) * (a • b) * a');
    let f = exp.solve();

    let v = f(In);
    console.log('Rodrigues in Vector form: ');
    console.log('v = ', v.toString(), "\n");
})(In);

((In) => {
    let str = 'I + sin(w) * K(a) + (1 - cos(w)) * K2(a)';
    let exp = Parser.createExpression(str);
    let f = exp.solve();

    let R1 = f(In); let v1 = R1.mulv(In.b);
    console.log('Matrix Expression: ' + str);
    console.log(R1.toString());
    console.log('det(R1) = ', R1.det());
    console.log('v = ', v1.toString());
    console.log('len(v) = ', v1.length().toFixed(2), "\n");

    console.log("ByAngleAxis: R2 =");
    let R2 = Matrix3x3.ByAngleAxis(In.w, In.a); let v2 = R2.mulv(In.b);
    console.log(R2.toString());
    console.log('det(R2) = ', R2.det());
    console.log('v = ', v2.toString());
    console.log('len(v) = ', v2.length().toFixed(2), "\n");
})(In);

(() => {
    let f = Parser.createExpression('1/x').solve();
    console.log(f({ x:8 }));
})();

(() => {
    let out, str; console.log("");

    let M = new Matrix3x3([
        1, 1, -5,
        2, 1, 4, 
        3, -1, -1
    ]);
    let det = M.det();
    let adj = M.adj();
    out = M.toString(); console.log(out, "\n");
    out = M.transpose().toString(); console.log("M.trans \n" + out, "\n");

    console.log("det(M) =", det);
    console.log("adj(M) =\n" + adj.toString(), "\n");
    let Minv = adj.transpose().scale(1/det);
    console.log("M.inv =\n" + Minv.toString(), "\n");
    console.log("M.inv * M =\n" + Minv.mul(M).toString(), "\n");

    out = Parser.createExpression("!M").solve()({M}).toString(); console.log("!M = \n" + out, "\n");
    out = Parser.createExpression("!M * M").solve()({M}).toString(); console.log("!M * M \n" + out, "\n");
    
    str = "(I + sin(w) * K(v) + (1-cos(w)) * K2(v)) * r"; out = Parser.createExpression(str).solve()({
        w: Math.PI / 6,
        v: new Vector3(1, 1, 2),
        r: new Vector3(1, 0, 0),
    }).toString(); console.log(str + "\n" + out, "\n");
})();
