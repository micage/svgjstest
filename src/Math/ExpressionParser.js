/*
Desired usage:
    const Expression = require("../../Math/ExpressionParser")

    let myExp = new Expression({
        str: "2x^7 + 3x -c1",
        vars: {
            x: { min: -1, max: 1 }, // range definition is optional,
                                    // should result in NaN if x is out of range
            y // y is defined but it's value is not, which is fine
        },
        consts: { c1: 1.2 }
    });
    let f = myExp.solve();
    console.log("f(0.2, 5) = ", f(2, 5));

TODO: count number of distinct variables

*/
const __ = require("../Util/ParamCheck"); 

// array helper
const peek = arr => arr[arr.length - 1];
const unique = arr => arr.filter((v, i, a) => a.indexOf(v) === i);


const NumberNode = function (str) {
    this.name = str;
    this.v = parseFloat(str);
    if (__DEBUG__ && (isNaN(this.v) || !isFinite(this.v))) {
        console.error("Not a number " + this.v);
        this.v = NaN;
    }
};
NumberNode.prototype.eval = function () {
    return this.v;
}

const ConstantNode = function (str, value) {
    this.name = str;
    this.v = value;
};
ConstantNode.prototype.eval = function () {
    return this.v;
};

const VariableNode = function (name, env) {
    this.name = name;
    this.env = env;
};
VariableNode.prototype.eval = function () {
    return this.env.vars[this.name];
};

const FunctionNode = function (str, fun) {
    this.name = str;
    this.fun = fun;
    this.node = null;
    if (__DEBUG__ && !__.checkFunction(this.fun)) {
        console.error("Not a registered function " + this.fun);
        this.op = { fun: (a) => a, prec: 2, assoc: "left" }; // identity
    }
};
FunctionNode.prototype.eval = function () {
    return this.fun(this.node.eval());
};

/**
 * @param {String} op
 * @param {NumberNode|ConstantNode|VariableNode} value
 */
const UnaryOperatorNode = function (str, def) {
    this.name = str + "u";
    this.node = null;
    this.op = def;
    if (__DEBUG__ && !__.checkObject(this.op)) {
        console.error("Not a registered unary operator " + str);
        this.op = { fun: (a) => a, prec: 3 }; // identity
    }
};
UnaryOperatorNode.prototype.eval = function () {
    return this.op.fun(this.node.eval());
};

/**
 * @param {String} op
 * @param {NumberNode|ConstantNode|VariableNode} leftValue
 * @param {NumberNode|ConstantNode|VariableNode} rightValue
 */
const BinaryOperatorNode = function (str, def) {
    this.name = str;
    this.lNode = null;
    this.rNode = null;
    this.op = def || {};
    if (__DEBUG__ && !__.checkFunction(this.op.fun)) {
        console.error("Not a registered binary operator " + str);
        this.op.fun = (a, b) => a; // return left value
    }
};
BinaryOperatorNode.prototype.eval = function () {
    return this.op.fun(this.rNode.eval(), this.lNode.eval());
};

/**
 * @param {Object} args
 * @param {Object} args.variables - 
 */
var P = function(args) {
    this.consts = args.constants || {};
    this.funs = args.functions || {};
    this.unops = args.unaryOperators || {};
    this.binops = args.binaryOperators || {};
};

/**
 * @param {String} str - the algebraic expression string e.g. "x^2 -3x * sin(pi/4)"
 */
P.prototype.RPN = function (str) {
    // let re = /(\d*\.?\d*)([×∆\!\|†•\+\*\-\/\^\(\)])/g; // without sign, so minus is a unary op
    let re = /([×∆\!\|†•\+\*\-\/\^\(\)])/g; // without sign, so minus is a unary op
    let trimmedExp = str.replace(/\s+/g, ''); // get rid of whitespaces
    let tokens = trimmedExp.split(re).filter(a => a); // split and get rid of empty array elements

    // build a string from all binops.str and one for all unops to test with indexOf
    let strBinOps = Object.keys(this.binops).join('');
    let strUnOps = Object.keys(this.unops).join('');

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

        if (strBinOps.indexOf(token) != -1) {
            let tok_1 = tokens[i-1];
            if (!tok_1 || tok_1 === '(' || strBinOps.indexOf(tok_1) != -1) { // in case it's also a unary op
                opst.push(new UnaryOperatorNode(token, this.unops[token]));
            }
            else {
                let op1;
                let op2 = new BinaryOperatorNode(token, this.binops[token]);

                // push all ops from opst to output that have greater precedence
                while ((op1 = peek(opst)) && op1 !== "(" && op1.op.prec > op2.op.prec) {
                    st.push(opst.pop());
                }
                opst.push(op2);           
            }
            continue;
        }
        else if (strUnOps.indexOf(token) != -1) { // it's a unary op and not a binary
            opst.push(new UnaryOperatorNode(token, this.unops[token]));
            continue;
        }

        // from here on it can only be an operand (number, constant or variable)
        // first test if it's a number or a scaled operand
        let ft = parseFloat(token);
        if (!isNaN(ft)) {
            // split 2.1a3 -> 2.1 * a3 
            let test = token.split(/([0-9]*\.?[0-9]*)([_a-zA-Z]+)/).filter(a => a);
            if (test.length == 1) {
                st.push(new NumberNode(ft));
                continue;
            }
            else { // it's a scale factor
                st.push(new NumberNode(test[0]));
                token = test[1];
                opst.push(new BinaryOperatorNode('*', this.binops['*']));
            }
        }

        if (tokens[i + 1] === '(') {
            opst.push(new FunctionNode(token, this.funs[token]));
        } else {
            if (this.consts[token]) {
                st.push(new ConstantNode(token, this.consts[token]));
            }
            else {
                st.push(new VariableNode(token, this));
            }
        }
    }

    st = st.concat(opst.reverse());
    return st;
};

P.prototype.AST = function (rpn) {
    let st = [];

    for (var i = 0; i < rpn.length; i++) {
        let node = rpn[i];
        if (node instanceof UnaryOperatorNode) {
            node.node = st.pop();
            st.push(node);
        }
        else if (node instanceof FunctionNode) {
            node.node = st.pop();
            st.push(node);
        }
        else if (node instanceof BinaryOperatorNode) {
            node.lNode = st.pop();
            node.rNode = st.pop();
            st.push(node);
        }
        else { // it's a number or const or var
            st.push(node);
        }
    }

    return st[0]; 
};

/**
 * @param {String} str - the expression to solve as a string
 * @returns {Function} - a multi-valued function depending on the number of indep. vars
 * In case there is an error it returns a function with no arguments
 * that returns undefined
 */
P.prototype.createExpression = function (str) {
    var exp = new Expression(this, str);
    return exp;
};

const Expression = function (Env, strExp) {
    this.Env = Env;
    this.exp = strExp;
    this.rpn = null;
    this.ast = null;
};

Expression.prototype.RPN = function () {
    this.rpn = this.rpn || this.Env.RPN(this.exp);
    return this.rpn;
};

Expression.prototype.AST = function () {
    this.ast = this.ast || this.Env.AST(this.RPN());
    return this.ast;
};

Expression.prototype.solve = function (vars) {
    let tokens = this.RPN();
    let varsUnique = tokens.reduce((a, v) => {
        if (v instanceof VariableNode) {
            if (!a.find(t => t.name === v.name)) {
                a.push(v);
            }
        }
        return a;
    }, []);
    let ast = this.AST();

    if (tokens.length) {
        let env = this.Env;

        return function (args) {
            args = args || {};
            if (Object.keys(args).length < varsUnique.length) {
                console.log(`Too few arguments. ${varsUnique.length} expected. No operation executed.`);
                return;
            }
            env.vars = args || {};
            return ast.eval();
        }
    }
};


module.exports = P;