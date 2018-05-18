let values = {
    x0: false,
    x1: false,
    x2: false,
    x3: false,
    x4: false,
};

const operators = {
    "&": {
        operands: 2,
        precedance: 2,
        fn: (a,b) => a && b
    },
    "|": {
        operands: 2,
        precedance: 1,
        fn: (a,b) => a || b
    },
    "¬": {
        operands: 1,
        precedance: 3,
        fn: (a) => !a
    }
};

let test_exp0 = "x0 & ¬x1 | x2";
let test_exp1 = "x0 & ¬(x1 | x2)";
let test_exp2 = "[x0 & ¬x1] | x2";
let test_exp3 = "[x0 | ¬x1] | (x2 & ¬x3)";
let test_exp4 = "([x0 | ¬x1] | (x2 & ¬x3) & (x1 | ¬x0)";

const eat_spaces = str => str.replace(/\s/g, '');
const is_var = str => str.match(/x[0-9]/i) !== null;
const is_op = str => str.match(/(&|\|)/i) !== null;

const peek = a => a[a.length - 1];

// TODO: check malformed input
const calc = (tokens) => {
    let depth = 0;
    let ops = [];
    let rpn = [];
    tokens.forEach((v, i) => {
        if (is_var(v)) {
            rpn.push(v);
        }
        // TODO: add precedence and associativity check
        else if (is_op(v)) { 
            ops.push(v);
        }
        else if (v === '(') {
            depth++;
            ops.push(v);
        }
        else if (v === ')') {
            while(peek(ops) !== "(") {
                rpn.push(ops.pop());
            }
            ops.pop(); // pop the opening brace
            depth--;
        }
        else if (v === '[') {
            depth++;
            ops.push(v);
        }
        else if (v === ']') {
            while (peek(ops) !== "[") {
                rpn.push(ops.pop());
            }
            ops.pop(); // pop the opening brace
            depth--;
        }
        else {
            throw "syntax error at index " + i
        }
    });
    while(ops.length > 0) {
        rpn.push(ops.pop());
    }
    return rpn;

};

const solve = (rpn) => {
    let result = [];
    rpn.forEach((v,i,a) => {
        if(v[0] === '¬') {
            result.push(!values[v.slice(1)]);
        }
        else if (v[0] === 'x') {
            result.push(values[v]);
        }
        else {
            var a = result.pop();
            var b = result.pop();
            if (v in operators) {
                result.push(operators[v].fn(a, b));
            }
        }
    });
    return result; 
};

const evaluate = (str) => {
    let s = str.replace(/\s/g, '');
    let tokens = s.split(/([\&\|\(\)\[\]])/);
    tokens = tokens.filter(String);

    let rpn = [];
    try {
        rpn = calc(tokens);
    } catch (e) {
        console.log(e);
    }
    
    let res;
    try {
        res = solve(rpn);
    } catch(e) {
        console.log(e);        
    }

    console.log(values);    
    console.log(str + " = " + res);    
    console.log('rpn: ' + rpn.join(', '));
};

evaluate(test_exp4);


// Hot Module Reloading
if (module.hot) {
    module.hot.accept();
}