import * as __ from "../Util/ParamCheck";

/* Manifesto
Maybe this the point where the buzzword "immutability" comes into play.
An observable can only detect changes to it's value. If properties
inside an object are changed the reference stays the same. So the value
of the observable will not change, hence no listener will be called.

But replacing a complete structure, just that the observable will
detect a change is a ridiculous waste of CPU usage. And the waste
increases with the size of the structure that has been changed.
(-> react, and their 'oppinionated' immutability bla bla)

We can provide specialized observables for complex datatypes - 
like ObservableArray, ObservableTree. 

Drawback: we cannot just call "get" or "set" value for such a type.
This would replace the reference to the container.

Instead we have to call functions which alter a member of the container 
and inform the listener which member has changed. 
ObservableTree for example would act as a proxy to a "real" 
tree. This approach makes it easy not only to detect changes but also 
exactly what has changed.
*/

/**
 * @class
 * @constructor
 * @private
 */
const Observable = function (listener) {
    this._listeners = (listener ? [listener] : []);
}

Observable.prototype = {
    /** @param {function(val): undefined} callback - comment */
    addListener: function (callback) {
        this._listeners.push(callback);
    },

    /** @param {function(val): undefined} callback - comment */
    removeListener: function (callback) {
        var i = this._listeners.length;
        while (i--) { // 0 is included
            if (this._listeners[i] === callback) {
                this._listeners.splice(i, 1); // remove found listener
                return;
            }
        }
    },

    /** @private */
    _callback: function (val) {
        var i = this._listeners.length;
        while (i--) { // 0 is included
            this._listeners[i].call(this, val);
        }
    }
};


/**
 * @class
 * @constructor
 */
var ObservableValue = function (val, listener) {
    Observable.call(this, listener);
    this._val = val;
}

ObservableValue.prototype = Object.create(Observable.prototype, {
    value: {
        get: function () { return this._val },
        set: function (val) {
            if (this._val !== val) {
                this._val = val;
                this._callback(val);
            }
        },
    }
});


/**
 * @class
 */
var ObservableRangedValue = function (val, min, max, listener) {
    Observable.call(this, listener);
    this._val = val;
    this._min = min;
    this._max = max;
    this._dx = max - min;
}

ObservableRangedValue.prototype = Object.create(Observable.prototype, {
    min: {
        get: function () { return this._min }
    },
    max: {
        get: function () { return this._max }
    },
    value: {
        get: function () { return this._val },
        set: function (val) {
            let oldVal = this._val;
            
            if (this._min > val) {
                this._val = this._min;
            } 
            else if (this._max < val) {
                this._val = this._max;
            }
            else {
                this._val = val;
            }

            if (oldVal !== this._val) {
                this._callback(this._val);
            }
        },
    },
    getRatio: {
        value: function() {
            return (this._val - this._min) / this._dx;
        }
    },
    setFromRatio: {
        value: function (ratio) {
            let oldVal = this._val;
            if (0 > ratio) this._val = this._min;
            if (ratio > 1) this._val = this._max;
            else this._val = this._min + ratio * this._dx;
            if (this._val !== oldVal) {                
                this._callback(this._val);
            }
        }
    }
});


/**
 *  @class
 */
var ObservableArray = function (arr, listener) {
    Observable.call(this, listener);
    this._arr = arr;
}

ObservableArray.prototype = Object.create(Observable.prototype, {
    /** @param {Number} index - will be inserted at the end
     *  @return {*} value at index
     */
    remove: {
        value: function(index) {
            let ret = this._arr[index]
            delete this._arr[index];
            return ret;
        }
    },
    /** @param {*} val - value will be inserted at the end */
    push: {
        value: function(val) {
            this._arr.push(val);
        }
    },
    /** @param {number|string|boolean} val - comment */
    setValueAtIndex: (index, val) => {
        let vali = this._val[index];
        if (vali !== val) {
            this._val[index] = val;
            this._callback(index, val);
        }
    },
    /** @param {number|string|boolean} val - comment */
    getValueAtIndex: (index, val) => {
        return this._arr[index];
    },
});

/**
 * The actual tree class needs to have a findNode function that
 * takes a full path and returns the appropriate node
 */
class ObservableTree {
    constructor(tree) {
        if (!__.checkObject(tree)) throw new Error("No valid Tree");
        this._tree = tree;
    }
    createNode(fullPath, nodeAccessor) {
        let node = this._tree.findNode(fullPath);
    }
    readNode(fullPath) {

    }
    modifyNode(fullPath, data) {

    }
    deleteNode(fullpath) {

    }
};


export {
    ObservableValue,
    ObservableRangedValue,
    ObservableArray,
    ObservableTree
}
    