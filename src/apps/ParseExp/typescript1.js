const ts = require("typescript");

// let sourceCode = `console.log("Hello, World!");`;
let sourceCode = "let res = -(b * -a)/ (A - -1.2n)";

// Parse the code.
let tsSourceFile = ts.createSourceFile(
    __filename,
    sourceCode,
    ts.ScriptTarget.Latest
);

// tsSourceFile.statements[0].expression.arguments[0].text = "Changed text";

// Print the modified source code.
let p = ts.createPrinter();
let res = p.printFile(tsSourceFile);
console.log(tsSourceFile);

/*
This will output:
console.log("Changed text");
*/