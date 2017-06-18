var _div = document.createElement("div");

// HTMLDivElement - subclass
function MDiv() {
    HTMLDivElement.call(this); // calling this constructor fails
}

// subclass extends superclass
MDiv.prototype = Object.create(Object.getPrototypeOf(_div));
MDiv.prototype.constructor = MDiv;

export default MDiv;