/**
 @typedef FrameParamType
 @type {Object}
 @property {number} x
 @property {number} y
 @property {number} scale
 @property {number} angle
 */

/**
 @typedef FrameInfoType
 @type {Object}
 @property {boolean} doContinue
 @property {boolean} hasChildren
 @property {boolean} isLastChild
 @property {number} depth
 */

/**
 @typedef FrameVisitorType
 @callback
 @param {Frame2D} frame
 @param {FrameInfoType} info
 @returns {boolean}
 */

/**
 @callback FrameIteratorType
 @param {Frame2D} frame
 @returns {boolean}
 */


const PI_OVER_180 = Math.PI / 180;

const DefaultParams = {
    x: 0,
    y: 0,
    scale: 1,
    angle: 0
};

/**
 * @class
 * @param params {FrameParamType}
 */
const Frame2D  = function(params) {
    let pp = Object.assign({}, DefaultParams, params || {});
    this._name = "";
    this._x = pp.x;
    this._y = pp.y;
    this._s = Number.equals(pp.scale, 0) ? 1e-7 : pp.scale;
    this._angle = pp.angle;
    this._parent = null;
    this._children = [];
    this._items = [];
}

Frame2D.prototype = {
    /** @return {string} */
    get name() { return this._name; },

    /** @param {string} name */
    set name(name) {
        if (typeof name === 'string' && name.length > 0) {
            this._name = name;
        }
    },

    /** @return {number} */
    get scale() { return this._s; },

    /** @param {number} s the new scale */
    set scale(s) { Number.equals(s, 0) ? this._s = 1e7 : this._s = s; },

    /** @returns {number} */
    getRootScale() {
        let s = this._s, parent = this._parent;
        while (parent) {
            s *= parent.s;
            parent = parent._parent; // one level up
        }
        return s;
    },

    /** @returns {{ x: number, y: number }} */
    getPosition() {
        return { x: this._x, y: this._y };
    },

    /**
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this._x = x;
        this._y = y;
    },

    /** @returns {{ x: number, y: number }} */
    getRootPosition() {
        var x = this.x, y = this.y, parent = this._parent;
        while (parent) {
            x += parent.x;
            y += parent.y;
            parent = parent._parent; // one level up
        }
        return { x, y };
    },

    /** @returns {boolean} */
    hasChildren() {
        return (this._children.length > 0);
    },
    
    /** @returns {boolean} */
    isLastChild() {
        let n = this._parent.getNumChildren();
        for (let i = 0; i < n-1; i++) {
            if (this._parent.getChild(i) === this && i !== (n-1) ) {
                return true;
            }
        }
    },

    /**
     * @param {string} name
     * @return {number|undefined}
     */
    findByName(name) {
        return this._children.find((f) => f.name === name);
    },

    /**
     * @param {number} index
     * @return {number|undefined}
     */
    findByIndex(index) {
        return this._children[index];
    },

    /** @return {number} */
    getNumChildren() {
        return this._children.length;
    },

    /** @return {Frame2D} */
    getParent() {
        return this._parent;
    },

    // todo: not so easy, remove from parent if exists
    setParent(p) {
        this._parent = p;
    },

    /** @param {Frame2D} child */
    addChild(child) {
        if (child._parent) {
            child._parent.removeChild(child);
        }
        child._parent = this;
        this._children.push(child);
        return child;
    },

    removeChild(child) {
        this._children = this._children.filter((f) => child === f);
        child._parent = null;
        return child;
    },

    /** @param {{(f: Frame2D) => boolean}} cb */
    eachFrame(cb) {
        let len = this._children.length;
        for(let i = 0; i < len; i++) {
            let ret = cb(this._children[i]);
            if(ret === false) {
                return;
            }
        }
    },

    /** Recursive tree traversal
     * @param {FrameVisitorType} visitor if visitor returns false the traversal is stopped
     * @param doVisitRoot {boolean} true if visiting root should be included
     */
    traverse(visitor, doVisitRoot = true) {

        let infoInfoType = {
            depth: 0,
            doContinue: true,
            isLastChild: true,
            hasChildren: this.hasChildren()
        };

        if (doVisitRoot) {
            visitor(this, info);
        }

        this._preOrder(visitor, info).bind(this);
    },

    addItem(item) {
        this._items.push(item);
    },

    removeItem(item) {
        let it = (_item) => _item === item;
        this._items = this._items.filter(it);
    },

    /** @param {FrameIteratorType} cb */
    eachItem(cb) {
        this._items.forEach(cb);
    },

    /** recursively steps through the frame tree and calls draw
     *  on each attached item
     *  @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // recursively traverses the tree of frames
        let frameIt = (frame) => {
            frame.draw(ctx);
        };
        this.eachFrame(frameIt);

        // post-order call => leaves of tree are drawn first
        let cos = Math.cos(this._angle * PI_OVER_180) * this._s;
        let sin = Math.sin(this._angle * PI_OVER_180) * this._s;
        ctx.setTransform(cos, -sin, sin, cos, this._x, this._y);

        let drawIt = function(item) {
            ctx.save();
            ctx.lineWidth /= Math.abs(this._s);
            item.draw(ctx, this);
            ctx.restore();
        };
        this.eachItem(drawIt.bind(this));
    },

    //========================================================================

    // todo: incomplete, add x, y, w, h, s
    toString() {
        return this._name + ": (" + this._children.length + ")";
    }
};


// allows stopping of traversal if visitor returns false
/**
 * @param {FrameVisitorType} visitor
 * @param {FrameInfoType} info
 */
const _preOrder = function(visitor, info) {
    for(var i = 0; i < this._children.length; i++) {
        if(info.bContinue !== false) {
            let frame = this._children[i];

            info.bIsLast = i === this._children.length - 1 ? true : false;
            info.bHasChildren = frame.hasChildren();
            info.bContinue = visitor(frame, info);

            if (info.bHasChildren) {
                info.depth++;
                frame.preOrder(visitor, info);
                info.depth--;
            }
        }
    }
};

/**
 * @param {FrameVisitorType} visitor
 */
const _nostop_preOrder = function(visitor) {
    var callNode = function(frame) {
        visitor(frame);
        frame._nostop_preOrder(visitor);
    };
    this.eachFrame(callNode);
};

/**
 * @param {FrameVisitorType} visitor
 */
const _nostop_postOrder = function(visitor) {
    var callChild = function(frame, isLast) {
        frame._nostop_postOrder(visitor);
        visitor(frame, isLast, frame.hasChildren());
    };
    this.eachFrame(callChild);
};


//========================================================================
module.exports = Frame2D;

if (typeof window !== 'undefined') {
    Object.assign(window.MICAGE = window.MICAGE || {}, {
        Frame2D
    });
}
