
const getType = param => Object.prototype.toString.call(param);

const checkType = (param, type) => !!param && getType(param) === `[object ${type}]`;

const checkBoolean = (param) => checkType(param, "Boolean");
const checkNumber = (param) => checkType(param, "Number");
const checkObject = (param) => checkType(param, "Object");
const checkArray = (param) => checkType(param, "Array");
const checkString = (param) => checkType(param, "String");
const checkFunction = (param) => checkType(param, "Function");
const checkNull = (param) => getType(param) === '[object Null]';
const checkUndefined = (param) => getType(param) === '[object Undefined]';

export {
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
}