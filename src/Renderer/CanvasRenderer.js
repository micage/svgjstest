
/** @type {HTMLCanvasElement} */
let cvs = null;

/** @type {CanvasRenderingContext2D} */
let ctx = null;

if (!cvs) {
    cvs = document.createElement("canvas");
    ctx = cvs.getContext('2d');
    cvs.style.width = "100%"
    cvs.style.height = "100%"
}

/**
 * @typedef {Object} Style
 * @property {string} name
 * @property {number} lineWidth
 * @property {string} strokeStyle
 * @property {string} fillStyle
 */

/** @type {Object.<string, Style>} */
let styles = {};
let numStyles = 0;
const DefaultStyle = {
    name: "DefaultStyle",
    fillStyle: "#eca",
    strokeStyle: "#777",
    lineWidth: 1,
};
styles.default = DefaultStyle;

/**
 * @typedef CanvasRenderer
 * @type {object}
 */
const CanvasRenderer = {
    get dom() { return cvs; },        
    get ctx() { return ctx; },

    clear() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
    },

    /** @returns {string} name of the style */
    createStyle(args) {
        let style = {
            name: args.name || ("style" + numStyles),
            fillStyle: args.fill || "#abc",
            strokeStyle: args.stroke || "#777",
            lineWidth: args.lineWidth || 1,
        };

        styles[style.name] = style;

        return style.name;
    },

    /** @param {string} name */
    setStyle(name) {
        Object.assign(ctx, styles[name] || DefaultStyle);
    },

    line(_from, _to) {
        ctx.beginPath();
        ctx.moveTo(_from.x, _from.y);
        ctx.lineTo(_to.x, _to.y);
        ctx.closePath();
        ctx.stroke();
    },

    rect(x, y, w, h, filled) {
        filled ? ctx.fillRect(x, y, w, h) : ctx.fillRect(x, y, w, h);
    },

    circle(x, y, r, filled) {
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        filled ? ctx.fill() : ctx.stroke();
    },

    /** @param {Vertex[]} vertices */
    path(vertices) {
        debugger;
    }
};


// Note: after creation canvas width and heigt aren't valid yet.
// after appending it to it's parent it is (reason: 100% style)


module.exports = CanvasRenderer;
// export default CanvasRenderer;