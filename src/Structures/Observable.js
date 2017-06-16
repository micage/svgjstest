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
like ObservableArray, ObservableTree. By just calling "get" or "set" 
for such a type we would replace the reference to the container.

Instead we have to call functions which 
alter a member of the container and inform the listener which member
has changed. ObservableTree for exaple would act as a proxy to a "real" 
tree. This approach makes it easy not only to detect changes but also 
exactly what has changed.
*/

/**
 * @constructor
 */
const Observable = function () {
    this._listeners = [];
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
 */
var ObservableValue = function (val) {
    Observable.call(this);
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
var ObservableRangedValue = function (val, min, max) {
    Observable.call(this);
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
var ObservableArray = function (arr) {
    Observable.call(this);
    this._arr = arr;
}
ObservableArray.prototype = Object.create(Observable.prototype, {
    removeEntry: {
        value: function() {

        }
    },
    /** @param {*} value - will be inserted at the end */
    addEntry: (value) => {

    },
    /** @param {number|string|boolean} val - comment */
    setValueAtIndex: (index, val) => {
        this._val = val;
        this._callback(val);
    },
});

export {
    ObservableValue,
    ObservableRangedValue,
    ObservableArray
}
    