global.__DEBUG__ = true;

//==========================================
const ExpParser = require("../../Math/ExpressionParser");

let P = new ExpParser({
    constants: {
        "e": Math.E,
        "pi": Math.PI
    },
    functions: {
        "sin": a => Math.sin(a),
        "cos": a => Math.cos(a),
        "tan": a => Math.tan(a),
    },
    unaryOperators: {
        "-": { fun: a => -a, prec: 3 },
        "!": { fun: a => 1/a, prec: 3 },
    },
    binaryOperators: {
        "+": { fun: (a, b) => a + b, prec: 2, assoc: "left" },
        "-": { fun: (a, b) => b - a, prec: 2, assoc: "left" },
        "*": { fun: (a, b) => a * b, prec: 3, assoc: "left" },
        "/": { fun: (a, b) => b / a, prec: 3, assoc: "left" },
        "^": { fun: (a, b) => Math.pow(b, a), prec: 4, assoc: "right" },
        "·": { fun: (a, b) => b.dot(a), prec: 3, assoc: "left" }, // alt-shift-9
        "∆": { fun: (a, b) => b.cross(a), prec: 4, assoc: "left" }, // alt-k
    }
});

//=======================================================
let strExp0 = "x^3^2";
let exp0 = P.createExpression(strExp0);
let rpn0 = exp0.RPN();
console.log(rpn0.map(v => v.name).join(' '));

//=======================================================
let strExp1 = "-1.2x^3 -5y^2 * sin(x + -.6pi)";
let exp1 = P.createExpression(strExp1);
let rpn1 = exp1.RPN();
console.log(rpn1.map(v => v.name).join(' '));

let exp1AST = exp1.AST();
console.log(exp1AST);

let f1 = exp1.solve();
console.log(strExp1 + ' = ', f1(1,2));


//=======================================================
let strExp2 = "!3";
let rpn2 = P.RPN(strExp2);
console.log(rpn2.map(v => v.name).join(' '));

//=======================================================


let f = P.solve(strExp1);
let s = P.solve(".01x-.5"); // linear mapping
console.log(`f(3, 2) = ${f(3, 2)}`);

let ar;
ar = [...Array(100)].map((v, y) => [...Array(100)].map((v, x) => f(s(x), s(y))));
console.log(ar);

