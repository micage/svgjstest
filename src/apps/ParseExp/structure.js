// only notes


let expression_1 = "-1.2/(A-B) *        sin(w*-1.2*t) * e^-(x^2+y^-2.1)";

const successors = {
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

let tree = {
    opDiv: {
        l: new NumberNode(-1.2),
        r: 2
    }
};


infix: '1+sin(a+b*3)*2'
infix_t: 'num op2 fun ( num op2 num ) op2 num'

rpn: '1 a b + sin 2 * +'
rpn_t: 'num num num op2 fun num op2 op2'

st: ['num']
st: ['num', 'num']
st: ['num', 'num', 'num']
st: ['num', 'op2*']
st: ['num', 'fun*']
st: ['num', 'fun*', 'num']
st: ['num', 'op2*']
st: ['op2*']

/*
functions and unary ops eat the last element of the stack
binops eat the last two elements of the stack
*/

/* Shunting Yard Algorithm
    1.  While there are tokens to be read:
    2.        Read a token
    3.        If it's a number add it to queue
    4.        If it's an operator
    5.               While there's an operator on the top of the stack with greater precedence:
    6.                       Pop operators from the stack onto the output queue
    7.               Push the current operator onto the stack
    8.        If it's a left bracket push it onto the stack
    9.        If it's a right bracket
    10.            While there's not a left bracket at the top of the stack:
    11.                     Pop operators from the stack onto the output queue.
    12.             Pop the left bracket from the stack and discard it
    13. While there are operators on the stack, pop them to the queue
*/



/*
1 + sin(a + b * 3) * 2  ->  1 a b 3 * + 2 * sin +

| 1
1 | a
1 a | b
1 a b | 3
1 a b 3 | *
1 a b*3 | +
1 a+b*3 | 2
1 a+b*3 2 | *
1 (a+b*3)*2 | sin
1 sin((a+b*3)*2) | +
1+sin((a+b*3)*2)     <- wrong


- ( A - B ) * - ( - a - 1.2 )  ->  A B - -u a -u 1.2 - -u *

| A
A | B
A B | -
A-B | -u
-(A-B) | a
-(A-B) a | -u
-(A-B) -a | 1
-(A-B) -a 1 | -
-(A-B) -a-1 | -u
-(A-B) -(-a-1) | *
-(A-B) * -(-a-1) |    <- correct

P-Konto Freibetrag erhöhen: Antrag nach § 850 k Absatz 5 ZPO beim Finanzamt

When truth gets buried deep
Beneath a thousand years of sleep
Time demands a turn around
And once again the truth is found

let space = new mmm.Space();
let eq1 = new mmm.Expression('a*(b+c)');

console.log(eq1.toString(), " = ", eq1.solve());



*/
// A regex for an identifier:
let rx_id = /[a-zA-Z_][a-zA-Z_0-9]*/