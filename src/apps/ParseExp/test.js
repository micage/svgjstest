if (global) global.__DEBUG__ = true;

let xy = require("./main.js");

/*
*   Test
*/
console.log("Welcome to Parse Math Expressions");

let expression_0 = "-(b * -a)/ (A - -1.2)";
let expression_1 = "-1.2/(A-B) *  sin(w*-1.2*t) * e^-(x^2+y^-2.1)";
let expression_1a = "-1.2/(A-B)";// *  sin(w*-1.2*t) * e^-(x^2+y^-2.1)";
let expression_1b = "sin(w*-1.2 * 0.1)";
let expression_1c = "e^-(x^2+y^2)";
let expression_2 = "-(A -B)*-(-a-1.2)";
let expression_3 = "1+sin(a+b*3)*2";
let expression_4 = "4^3^2";
let expression_5 = "4^(2+1)^2";
let expression_6 = "Apfel + Birne";

xy.defineConstant("w", 2 * Math.PI);
xy.defineConstant("A", 1.35);
xy.defineConstant("B", -0.4);
xy.defineVariable("a", -2, 2, 40, (a) => {
    doSomethingWith(a);
});
xy.defineVariable("b", -3, -1, 20);
xy.defineVariable("x", -1, 1, 20);
xy.defineVariable("y", 1, -1, 20);
xy.defineVariable("t", .3, .4, 20);

let exp = expression_3;
// console.log(exp, " = ", xy.solve(exp), '\n');
// console.log(xy.solve('2.1a+4b'), '\n');
// console.log(xy.solve('2.1a^2+4b^2.1'), '\n');
// console.log(xy.solve('2.1*a^2+4*b^2.1'), '\n');
// console.log(xy.solve('(-2.1a)^2.1+(1-3b*2)^-2'), '\n');
// console.log(xy.solve('.5*2^3.1'), '\n');

let eq1 = "3x/y-2A";
let fn = xy.solve(eq1);
let result = fn(2, 9);
console.log(`(2, 9) => ${eq1} = ${result}, mit x = 2, y = 9, A = 1.35`);

xy.defineConstant("c1", -1.25);
let eq2 = "2x^2 + 3y -c1";
let fn2 = xy.solve(eq2);
console.log(`(1, 2) => ${eq2} = ${fn2(-2,-1)}`);

let K = "r * cot(r)";
let r_ = "0.5 * (w x r + K * w + (1 - K) r % r * w)";

"w2 * r3 - w3 * r2", "->", "  0 -w3  w2", "r1*r1 r1*r2 r1*r3" 
"w3 * r1 - w1 * r3", "->", " w3   0 -w1", "r1*r2 r2*r2 r2*r3"
"w1 * r2 - w2 * r1", "->", "-w2  w1   0", "r1*r3 r2*r3 r3*r3"