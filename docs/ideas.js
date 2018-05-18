
let expression = "(A-B) * sin(w*t) * e^-(x^2+y^2)";

let variables = [];
let constants = [];

let binaryOperators = {
    "+": add,
    "-": substract,
    "*": multiply,
    "/": divide,
    "^": pow
}

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
const defineBinaryOperator = function (str, fun) {

};

/**
 * @param {String} str - the constant
 */
const defineConstant = function (str) {

};

/**
 * @param {String} str - the constant
 */
const defineVariable = function (str) {

};

