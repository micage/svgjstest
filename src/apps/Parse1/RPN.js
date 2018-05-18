function MathSolver() {

    this.infixToPostfix = function (infix) {
        var outputQueue = "";
        var operatorStack = [];
        var operators = {
            "^": {
                precedence: 4,
                associativity: "Right"
            },
            "/": {
                precedence: 3,
                associativity: "Left"
            },
            "*": {
                precedence: 3,
                associativity: "Left"
            },
            "+": {
                precedence: 2,
                associativity: "Left"
            },
            "-": {
                precedence: 2,
                associativity: "Left"
            }
        }

        infix = infix.replace(/\s+/g, "");
        infix = infix.split(/([\+\-\*\/\^\(\)])/).filter(a => a);

        for (var i = 0; i < infix.length; i++) {
            var token = infix[i];

            if (token == +token) {
                outputQueue += token + " ";
            }

            else if ("^*/+-".indexOf(token) !== -1) { // is token an operator?
                var op1 = token;
                var op2 = operatorStack[operatorStack.length - 1]; // last pushed operator
                
                while (
                    "^*/+-".indexOf(op2) !== -1 && // is operator and ...
                    (
                        (
                            operators[op1].associativity === "Left" && 
                            operators[op1].precedence <= operators[op2].precedence
                        ) || 
                        (
                            operators[op1].associativity === "Right" && 
                            operators[op1].precedence < operators[op2].precedence
                        )
                    )
                ) {
                    outputQueue += operatorStack.pop() + " "; // push last operator to output
                    op2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(op1);
            }

            else if (token === "(") {
                operatorStack.push(token);
            }

            else if (token === ")") {
                while (operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue += operatorStack.pop() + " ";
                }
                operatorStack.pop();
            }
        }

        // while (operatorStack.length > 0) {
        //     outputQueue += operatorStack.pop() + " ";
        // }
        outputQueue += operatorStack.reverse().join(" ");

        return outputQueue;
    }

    this.solvePostfix = function (postfix) {
        var st = [];
        postfix = postfix.split(" ");
        for (var i = 0; i < postfix.length; i++) {
            let val = postfix[i];
            if (!isNaN(parseFloat(val))) {
                st.push(val);
            } else {
                var a = st.pop();
                var b = st.pop();
                if (val === "+") {
                    st.push(parseInt(a) + parseInt(b));
                } else if (val === "-") {
                    st.push(parseInt(b) - parseInt(a));
                } else if (val === "*") {
                    st.push(parseInt(a) * parseInt(b));
                } else if (val === "/") {
                    st.push(parseInt(b) / parseInt(a));
                } else if (val === "^") {
                    st.push(Math.pow(parseInt(b), parseInt(a)));
                }
            }
        }
        if (st.length > 1) {
            return "error";
        } else {
            return st.pop();
        }
    }
}

let ms = new MathSolver();
let ex, str;
str = '(4 ^ 3) ^ 2'; 
ex = ms.infixToPostfix(str); 
console.log(ex + " = " + ms.solvePostfix(ex));
