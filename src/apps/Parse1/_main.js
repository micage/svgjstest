let x0 = false;
let x1 = false;
let x2 = false;
let x3 = false;
let x4 = false;

let test_exp = "x0 & ¬x1 | x2";
// let test_exp = "a | b & c";
// let test_exp = "a & b | c";
// let test_exp = "a & b | c";
// let test_exp = "a & b | c";

const eat_spaces = str => str.replace(/\s/g, '');
const is_var = str => str.match(/x[0-9]/i);
const is_op = str => str.match(/(&|\|)/i);

const sub1 = () => {

};

const sub2 = () => {

};

const bin_op = (char) => {
    if (char !== '|' || char !== '&') {
        return 'exp';
    }
    else if (!char) {
        return 'eoi';
    }
    
};

const eoi = () => {

};

let rules = {
    'all': ['start', 'x', 'num', '¬', '&', '|', '(', ')', '[', ']'],

    'exp': ['x', '¬', '(', '['],
    'x': ['num'],
    'num': ['&', '|'],
    '¬': ['exp'], // unary operator
    '&': ['exp'], // binary operator
    '|': ['exp'], // binary operator
    '(': sub1,
    '[': sub2,
    ']': [bin_op, eoi, ']', ')'],
    ')': [bin_op],
};

const calc = (str, i, rule) => {

    switch (rule) {
        case "exp":
            let idx = rules.exp.findIndex(v => str[i] === v);
            if (idx !== -1) {
                calc(str[i + 1], rules.exp[idx]);
            } else {
                throw "not an expression";
            }
            break;

        case "sub":
            if (condition) {
                
            }
            break;
    
        default:
            break;
    }



};

const evaluate = (str) => {
    let s = eat_spaces(str);
    calc(s, 0, 'exp');
};

evaluate(test_exp);