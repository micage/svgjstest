import * as __ from "../Util/ParamCheck";

/* Manifesto
Maybe this the point where the buzzword "immutability" comes into play.
An observable can only detect changes to it's value. If properties
of an object are altered the reference stays the same. So the value
of the observable hasn't changed and no listener has to be called.

Maybe we could provide specialized observable for complex datatypes - 
like ObservableArray, ObservableTree. We will not be able to just
"set" or "get" a value for this types. Instead we have to call
functions which alter a node of a tree for example and inform the
listener which node has changed. ObservableTree will act as an interface
to the "real" tree with which you can add or remove nodes, change
node data and so on.
*/

/**
 * @class
 * @constructor
 * @param {Number|String|Boolean} val
 */
var Observable = function () {
    this._listeners = [];
}

Observable.prototype = {
    /** @param {function(val): undefined} callback - comment */
    addListener: function (callback) {
        this._listeners.push(callback);
    },

    /** @param {function(val): undefined} callback - comment */
    removeListener: function (callback) {
        var i = 0,
            len = this._listeners.length;
        for (; i < len; i++) {
            if (this._listeners[i] === callback) {
                this._listeners.splice(i, 1); // remove found listener
                return;
            }
        }
    },

    /** @private */
    _callback: function (val) {
        var i = 0,
            len = this._listeners.length;
        for (; i < len; i++) {
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
    