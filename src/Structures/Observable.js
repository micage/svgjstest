import * as __ from "../Util/ParamCheck";

/* Manifesto
Maybe this is the point where the buzzword "immutability" comes into play.
An observable can only detect changes to it's value. If properties
inside an object are changed the reference stays the same. So the value
of the observable will not change, hence no listener will be called.
That is not good.

But replacing a complete and possibly huge structure, such that the 
observable will detect a change seems to be an overkill.
(-> plz see facebooks react, and their 'oppinionated' immutability bla bla)

We can provide specialized observables for complex datatypes - 
like ObservableArray, ObservableTree. 

Drawback: we cannot just call "get" or "set" value for such a type.
This would replace the reference to the container.

Instead we have to call functions which alter a member of the container 
and inform the listener which member has changed. 
ObservableTree for example would act as a proxy to a "real" 
tree. This approach makes it easy not only to detect changes but also 
know exactly what has changed.
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

ObservableArray.prototype = Object.create(Observable.prototype, 
{
    /** @param {Number} index - will be removed
     *  @return {*} value at position index
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


/**
 * This has to monitor a list
 * Only Observables are accessable by views, so the only thing a view can see
 * are the public functions of observables
 * data could be am array or an object (key , value)
 */
class ObservableList {
    constructor(args) {
        if (!__.checkObject(args.list)) throw new Error("No valid List");
        this._list = args.list;
    }
    /**
     * Your model has to know how to create an item
     * Here we just connect a name with some object your model.create gives back
     */
    createItem(name, onCreate, itemClass) {
        let node = onCreate(name);
        this._list.createItem
    }
    readItem(fullPath) {

    }
    editItem(fullPath, data) {

    }
    deleteItem(fullpath) {

    }
};


export {
    ObservableValue,
    ObservableRangedValue,
    ObservableArray,
    ObservableTree
}
    