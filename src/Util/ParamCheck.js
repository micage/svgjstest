
var getType = param => Object.prototype.toString.call(param);

var checkType = (param, type) => !!param && getType(param) === `[object ${type}]`;

var checkBoolean = (param) => checkType(param, "Boolean");
var checkNumber = (param) => checkType(param, "Number");
var checkObject = (param) => checkType(param, "Object");
var checkArray = (param) => checkType(param, "Array");
var checkString = (param) => checkType(param, "String");
var checkFunction = (param) => checkType(param, "Function");
var checkNull = (param) => getType(param) === '[object Null]';
var checkUndefined = (param) => getType(param) === '[object Undefined]';

module.exports = {
    getType,
    // checkType,
    checkBoolean,
    checkNumber,
    checkObject,
    checkArray,
    checkString,
    checkFunction,
    checkNull,
    checkUndefined,
};