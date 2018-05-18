const ts = require("typescript")

let sourceCode = `
console.log("Hello, World!");
`;

// Parse the code.
let tsSourceFile = ts.createSourceFile(
    __filename,
    sourceCode,
    ts.ScriptTarget.Latest
);

// Print the parsed Abstract Syntax Tree (AST).
console.log(tsSourceFile.statements);

/*
Output:
[
  {
    "kind": 210,  // ExpressionStatement
    "expression": {
      "kind": 181,  // CallExpression
      "expression": {
        "kind": 179,  // PropertyAccessExpression
        "expression": {
          "text": "console"
        },
        "name": {
          "text": "log"
        }
      },
      "arguments": [
        {
          "kind": 9,  // StringLiteral
          "text": "Hello, World!"
        }
      ]
    }
  }
]
*/
