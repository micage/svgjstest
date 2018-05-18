// import * as __ from "../../Util/ParamCheck"; 
const __ = require("../../Util/ParamCheck"); 

let variables = {};
let constants = {
    "e": Math.E,
    "pi": Math.PI
};
let unaryOperators = {
    "-": { fun: a => -a, prec: 3 }
};

let binaryOperators = {
    "+": { fun: (a, b) => a + b, prec: 2, assoc: "left" },
    "-": { fun: (a, b) => b - a, prec: 2, assoc: "left" },
    "*": { fun: (a, b) => a * b, prec: 3, assoc: "left" },
    "/": { fun: (a, b) => b / a, prec: 3, assoc: "left" },
    "^": { fun: (a, b) => Math.pow(b, a), prec: 4, assoc: "right" },
}

let functions = {
    "sin": a => Math.sin(a),
    "cos": a => Math.cos(a),
    "tan": a => Math.tan(a),
};

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
const defineFunction = function (str, fun) {
    if (functions[str]) return;
    functions[str] = fun;
};

/**
 * @param {String} str
 * @param {Function} fun - function that takes two number values and returns a Number
 */
const defineBinaryOperator = function (str, fun) {
    if (binaryOperators[str]) return;
    binaryOperators[str].fun = fun;
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


// const INode = (str) => { this.name = str; };

const NumberNode = function (str) {
    this.name = str;
    this.value = parseFloat(str);
    if (__DEBUG__ && (isNaN(this.value) || !isFinite(this.value))) {
        console.error("Not a number " + this.value);
        this.name = "NaN";
        this.value = 0;
    }
};
NumberNode.prototype.eval = function() { return this.value; }

const ConstantNode = function(str) {
    this.name = str;
    this.value = constants[str];
    if (__DEBUG__ && (isNaN(this.value) || !isFinite(this.value))) {
        console.error("Not a number " + this.value);
        this.name = "NaN";
        this.value = 0;
    }
};
ConstantNode.prototype.eval = function() {
    return this.value;
};

const VariableNode = function(str) {
    this.name = str;
    let _ = variables[str];
    if (__DEBUG__ && !_) {
        console.error("Not a registered function " + this.fun);
    }
    this.r0 = _.r0;
};
VariableNode.prototype.eval = function() {
    return this.r0;
};

const FunctionNode = function (str) {
    this.name = str;
    this.fun = functions[str];
    this.value = null;
    if (__DEBUG__ && !__.checkFunction(this.fun)) {
        console.error("Not a registered function " + this.fun);
        this.op = { fun: (a) => a, prec: 2, assoc: "left" }; // identity
    }
};
FunctionNode.prototype.eval = function() {
    return this.fun(this.value.eval());
};

/**
 * @param {String} op
 * @param {NumberNode|ConstantNode|VariableNode} value
 */
const UnaryOperatorNode = function(str, value) {
    this.name = str + "u";
    this.value = value;
    this.op = unaryOperators[str];
    if (__DEBUG__ && !__.checkObject(this.op)) {
        console.error("Not a registered unary operator " + str);
        this.op = { fun: (a) => a, prec: 3 }; // identity
    }
};
UnaryOperatorNode.prototype.eval = function() {
    return this.op.fun(this.value.eval());
};

/**
 * @param {String} op
 * @param {NumberNode|ConstantNode|VariableNode} leftValue
 * @param {NumberNode|ConstantNode|VariableNode} rightValue
 */
const BinaryOperatorNode = function(str, leftValue, rightValue) {
    this.name = str;
    this.leftValue = leftValue;
    this.rightValue = rightValue;
    this.op = binaryOperators[str];
    if (__DEBUG__ && !__.checkFunction(this.op.fun)) {
        console.error("Not a registered binary operator " + str);
        this.op.fun = (a, b) => a; // return left value
    }
};
BinaryOperatorNode.prototype.eval = function() {
    return this.op.fun(this.leftValue.eval(), this.rightValue.eval());
};

const peek = (arr) => arr[arr.length-1];

const rpn = (str) => {
    console.log('in: ' + str);
    
    let re = /(\d*\.?\d*)([\+\*\-\/\^\(\)])/g; // without sign, so minus is a unary op
    let trimmedExp = str.replace(/\s+/g, ''); // get rid of whitespaces
    let tokens = trimmedExp.split(re).filter(a => a); // split and get rid of empty array elements

    console.log('regex split: ', tokens.join(' '));

    let st = [];   // number, constant, variable stack
    let opst = []; // (, ), function, [u|bi]nary operator stack

    for (let i = 0; i < tokens.length; ++i) {
        let token = tokens[i];

        if (token === '(') {
            opst.push(token)
            continue;        
        }
        else if (token === ')') {
            // move all ops from op stack to output until '('
            while (opst[opst.length - 1] !== "(") {
                st.push(opst.pop());
            }
            opst.pop(); // remove '(' from op stack 
            let lastop = peek(opst);
            if (lastop instanceof FunctionNode || lastop instanceof UnaryOperatorNode) {
                st.push(opst.pop());
            }
            continue;        
        }

        if (token === '+' || token === '-') {
            if (!tokens[i - 1] || tokens[i - 1] === '(' || tokens[i - 1].match(/[\+\-\*\/\^]/) ) {
                opst.push(new UnaryOperatorNode(token));           
            }
            else {
                let op1;
                let op2 = new BinaryOperatorNode(token);
                // while(op1 !== "(" && op1) {
                while ((op1 = peek(opst)) && op1 !== "(") {
                    if (op1.op.prec >= op2.op.prec) { // TODO: check, before it was only >
                        st.push(opst.pop());
                    }
                }
                opst.push(op2);           
            }
            continue;        
        }
        else if (token === '*' || token === '/' || token === '^') {
            opst.push(new BinaryOperatorNode(token));           
            continue;        
        }

        let ft = parseFloat(token);
        if (!isNaN(ft)) {
            // split 2.1a3 -> 2.1 * a3 
            let test = token.split(/([0-9]*\.?[0-9]*)([_a-zA-Z]+)/).filter(a => a);
            if (test.length == 1) {
                st.push(new NumberNode(ft));
                continue;
            }
            else {
                st.push(new NumberNode(test[0]));
                opst.push(new BinaryOperatorNode('*'));
                token = test[1];
            }
        }

        if (tokens[i+1] === '(') {
            opst.push(new FunctionNode(token));
        } else {
            if (constants[token]) {
                st.push(new ConstantNode(token));
            }
            else if (variables[token]) {
                st.push(new VariableNode(token));
            }
            else {
                console.error("Not a registered const|var " + token);
                return [];
            }
        }
    }

    st = st.concat(opst.reverse());

    console.log('rpn: ' + st.map(s => s.name).join(' ') );
    
    return st;
}

/**
 * @param {Array} rpn - an array of XY-Nodes
 * XY- stands for UnaryOperatorNode, BinaryOperatorNode, FunctionNode, ...
 */
const ast = (rpn) => {
    let st = [];

    for (var i = 0; i < rpn.length; i++) {
        let node = rpn[i];
        if (node instanceof UnaryOperatorNode) {
            node.value = st.pop();
            st.push(node);
        }
        else if (node instanceof FunctionNode) {
            node.value = st.pop();
            st.push(node);
        }
        else if (node instanceof BinaryOperatorNode) {
            node.leftValue = st.pop();
            node.rightValue = st.pop();
            st.push(node);
        }
        else { // it's a number or const or var
            st.push(node);        
        } 
    }

    return st[0]; 
};

const solve = (str) => {
    let res = rpn(str);
    let ast0 = ast(res);
    if (res.length) {
        let vars = res.filter(node => node instanceof VariableNode);
        if (vars.length === 1) {
            vars[0].n = 0;
            return function(x) {
                vars[0].r0 = x;
                return ast0.eval();
            }
        }
        else if (vars.length === 2) {
            vars[0].n = 0;
            vars[1].n = 0;
            return function (x, y) {
                vars[0].r0 = x;
                vars[1].r0 = y;
                return ast0.eval();
            }
        }
        else if (vars.length === 3) {
            vars[0].n = 0;
            vars[1].n = 0;
            vars[2].n = 0;
            return function (x, y, z) {
                vars[0].r0 = x;
                vars[1].r0 = y;
                vars[2].r0 = z;
                return ast0.eval();
            }
        }
        else {
            console.log('too long.');
            return "error";
        }
    }
    return "error";
}

module.exports = {
    solve, ast, rpn,
    defineConstant,
    defineVariable,
    defineUnaryOperator,
    defineFunction,
    defineBinaryOperator,
}

