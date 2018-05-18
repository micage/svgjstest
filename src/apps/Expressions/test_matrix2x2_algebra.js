global.__DEBUG__ = true;

//==========================================
const ExpParser = require("../../Math/ExpressionParser");
const Matrix2x2 = require("../../Math/Matrix2x2.js");

let Parser = new ExpParser({
    constants: {
        X: new Matrix2x2([
            5, 2, 
            7, 3
        ]),
        S: new Matrix2x2([
            1, 1, 
            0, 1
        ]),
        R: new Matrix2x2([
            0, 1, 
            -1, 0
        ]),
    },
    unaryOperators: {
        "!": { fun: m => m.inverse(), prec: 3 },
        "-": { fun: a => -a, prec: 3 },
    },
    functions: {
        Sn: (n) => new Matrix2x2([1, n, 0, 1])
    },
    binaryOperators: {
        "*": { fun: (a, b) => a.mul(b), prec: 2 }
    }
});

(() => {
    let s;
    // s = 'X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = '!S'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = '!R'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'X * !R * A_n(1)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'X * !R * A_n(1) * !R * A_n(2) * !R * A_n(1) * !R'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'S * R * S * R * S * R'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    
    // add some constants
    Parser.consts.AB = Parser.createExpression('S * R').solve()();
    Parser.consts.BA = Parser.createExpression('R * S').solve()();
    Parser.consts.ABA = Parser.createExpression('S * R * S').solve()();
    Parser.consts.BAB = Parser.createExpression('R * S * R').solve()();
    Parser.funs.ABn = n => {
        let AB = Parser.consts.AB, M = AB;
        for (let i = 0; i < n - 1; i++) {
            M = M.mul(AB);            
        }
        return M;
    };
    Parser.funs.BAn = n => {
        let BA = Parser.consts.BA, M = BA;
        for (let i = 0; i < n - 1; i++) {
            M = M.mul(BA);            
        }
        return M;
    }

    // s = 'ABA'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = '!ABA'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'BAB'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());

    // s = 'AB * AB * AB'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'ABn(1)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'ABn(2)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'ABn(3)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'BA * BA * BA'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'BAn(1)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'BAn(2)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'BAn(3)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    
    // console.log("\n", "---- 3, 2 ----");    
    // s = 'X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'An(2) * R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = '!R * An(2) * R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    // s = 'An(3) * R * An(2) * !R * An(2) * R * X * An(3) * R * An(2) * !R * An(2) * R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());


    s = 'X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    s = 'R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    s = 'Sn(1) * R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    s = 'R * Sn(1) * R * X'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    s = 'Sn(-2) * R * Sn(2)'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
    s = '!(Sn(-2) * R * Sn(2))'; console.log(s, " =\n", Parser.createExpression(s).solve()().toString());
})();