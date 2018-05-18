const __DEBUG__ = true;

// import * as __ from "../../Util/ParamCheck"; 
const __ = require("../../Util/ParamCheck"); 

let variables = {};
let constants = {
    "e": Math.PI
};
let unaryOperators = {
    "-": a => -a
};

let binaryOperators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "^": (a, b) => Math.pow(a, b)
}

let functions = {
    "sin": a => Math.sin(a),
    "cos": a => Math.cos(a),
    "tan": a => Math.tan(a),
};

/**
 * operator functions
 */
const add = (a, b) => a + b;
const substract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

/**
 * @param {String} str
 * @param {Function} fun - function that takes two number values and returns a Number
 */
const defineUnaryOperator = function (str, fun) {
    if (unaryOperators[str]) return;
    unaryOperators[str] = fun;
};

/**
 * @param {String} str
 * @param {Function} fun - function that takes two number values and returns a Number
 */
const defineBinaryOperator = function (str, fun) {
    if (binaryOperators[str]) return;
    binaryOperators[str] = fun;
};

/**
 * @param {String} str - the constant
 */
const defineConstant = function (str, value) {
    if (constants[str]) return;
    constants[str] = value;
};

/**
 * @param {String} str - the constant
 * @param {Number} r0 - interval border 0
 * @param {Number} r1 - interval border 1
 * @param {Number} number of values
 */
const defineVariable = function (str, r0, r1, steps) {
    if (variables[str]) return;
    variables[str] = { r0, r1, steps };
};

console.log("Welcome to Parse Math Expressions");

const successors =  {
    '(': [

    ],
    ')': [

    ],
    '[A-Za-z]': [
        '[A-Za-z]', 
    ],
    '[+-*/]': [

    ]
};

/*
*   Test
*/
let expression_0 = "-(b * -a)/ (A - -1.2)";
let expression_1 = "-1.2/(A-B) *        sin(w*-1.2*t) * e^-(x^2+y^-2.1)";
let expression_2 = "-(A -B)*-(-a-1.2)";
let exp = expression_1;
// A - B
// 
defineConstant("w", 2 * Math.PI);
defineConstant("A", 1.05);
defineConstant("B", -0.4);
defineVariable("a", -2, 2, 40);
defineVariable("b", -3, -1, 20);
defineVariable("x", -1, 1, 20);
defineVariable("y", -1, 1, 20);
defineVariable("t", -1, 1, 20);

// regular expression with 2 capturing groups, for numbers and operators/brackets
// let re = /([-+]?\d*\.?\d*) ([+*-\/\^\(\)])/g;
// let re = /([\+\*\-\/\^\(\)])([-+]?\d*\.?\d*)/g;
// let re = /(\d+|\d+\.?\d+)/;
// let re = /([-+]?([0-9]+)|[0-9]+\.?[0-9]+)/g;
// let re = /([-+]?((\.[0-9]+|[0-9]+\.[0-9]+)([eE][-+]?[0-9]+)?|[0-9]+))/g;
// let re_float = /([-+]?\d*\.?\d*)/;
// let re_float2 = /[-+]?((\.[0-9]+|[0-9]+\.[0-9]+)([eE][-+]?[0-9]+)?|[0-9]+)/;
// let re1 = /([-+]?\.[0-9]+|[0-9]+\.[0-9]+) ([+*-\/\^\(\)])/g;
// let re2 = /([-+]?((\.[0-9]+|[0-9]+\.[0-9]+)([eE][-+]?[0-9]+)?|[0-9]+))([\+\*\-\/\^\(\)])/g;

// let re = /([-+]?\d*\.?\d*)([\+\*\-\/\^\(\)])/g; // first capture numbers then operators
let re = /(\d*\.?\d*)([\+\*\-\/\^\(\)])/g; // without sign, so minus is a unary op
let trimmedExp = exp.replace(/\s+/g, ''); // get rid of whitespaces
let tokens = trimmedExp.split(re).filter(a => a); // split and get rid of empty array elements

console.log('Exp: ', exp);
console.log('trimmedExp: ', trimmedExp);
console.log('Exp match: ' + '-1.2e4'.match(re));
console.log('regex 1c split: ', tokens.join(' '), '\n');

const Node = () => {
    this.value = null;
};

const FunctionNode = function(str) {
    this.value = str;
};
FunctionNode.prototype.eval = () => {
    return functions[this.value](this.value.eval());
};

const ConstantNode = function(str) {
    this.value = str;
};
ConstantNode.prototype.eval = () => {
    return constants[this.value];
};

const VariableNode = function(str) {
    this.n = 0
    let _ = variables[str];
    this.r0 = _.r0;
    this.steps = _.steps;
    this.del = (_.r1 - _.r0) / _.steps;
};
VariableNode.prototype.prev = () => { this.n ? this.n-- : this.n; }
VariableNode.prototype.next = () => { this.n === this.step ? this.n : this.n++; }
VariableNode.prototype.eval = () => {
    return this.r0 + this.n * this.del;
};

const NumberNode = function(number) {
    this.value = number;
};
NumberNode.prototype.eval = () => this.value;

const UnaryOperatorNode = function(op, value) {
    this.op = op;
    this.val = value;
    this.fun = unaryOperators[this.op];
    if (__DEBUG__ && !__.checkFunction(this.fun)) {
        console.error("Not a registered operator " + this.op);
    }
};
UnaryOperatorNode.prototype.eval = () => {
    return this.fun(this.val.eval());
};

const BinaryOperatorNode = function(op, leftValue, rightValue) {
    this.op = op;
    this.leftValue = leftValue;
    this.rightValue = rightValue;
};
BinaryOperatorNode.prototype.eval = () => {
    let fun = binaryOperators[this.op];
    if (__DEBUG__ && __.checkFunction(fun)) {
        console.error("Not a registered operator " + this.op);
    }
    return fun(this.leftValue.eval(), this.rightValue.eval());
};


let st = [];   // number, constant, variable stack
let obst = []; // (, ), function, [u|bi]nary operator stack

for (let i = 0; i < tokens.length; ++i) {
    let token = tokens[i];
    let t0 = token[0];
    if (t0 === '(') {
        obst.push(t0)
        console.log(token);
        continue;        
    }
    else if (t0 === ')') {
        // todo: pop operators until '('
        console.log(token);     
        while (obst[obst.length - 1] !== "(") {
            st.push(obst.pop());
        }
        obst.pop(); // remove '(' from op stack 
        continue;        
    }
    else if (t0 === '+' || t0 === '-') {
        // minus or plus (rarely used) can also a unary operator
        // if it's a binary operator there has to be a left and a right operand
        if (token.length != 1) {
            // it's part of a number
            // this code will not be reached if number are always unsigned (without  [-+])
            st.push(new NumberNode(parseFloat(token)));
            console.log('number: ' + token);
        } else {
            if (!tokens[i - 1] || tokens[i - 1] === '(' || tokens[i - 1].match(/[\+\-\*\/\^]/) ) {
                console.log('op1: ' + token);
                obst.push(new UnaryOperatorNode(token));           
            }
            else {
                obst.push(new BinaryOperatorNode(token));           
                console.log('op2: ' + token);
            }
        }
        continue;        
    }
    else if (t0 === '*' || t0 === '/' || t0 === '^') {
        console.log('op2: ' + token);
        obst.push(new BinaryOperatorNode(token));           
        continue;        
    }

    let ft0 = parseFloat(t0);
    if (!isNaN(ft0)) {
        console.log('num: ' + token);
        st.push(new NumberNode(ft0));
    }
    else {
        if (tokens[i+1] === '(') {
            console.log('fun: ' + token);        
            obst.push(new FunctionNode(token));
        } else {
            if (constants[token]) {
                console.log('con: ' + token);
                st.push(new ConstantNode(token));
            }
            else if (variables[token]) {
                console.log('var: ' + token);
                st.push(new VariableNode(token));
            }
            else {
                console.error("Not a registered const|var " + token);
            }
        }
    }
}

console.log(obst);
