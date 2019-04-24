

/**
 * All primitives are modelled in the simplest coordinate basis
 * { ex = <1, 0, 0>, ey = <0, 1, 0>, ez = <0, 0, 1>}
 * and then transformed via a frame matrix that holds position
 * and orientation with respect to it's parent frame.
 * In case there is no such frame which means it's a root
 * frame and it's frame matrix transforms vertex positions
 * from model into world coordinates
 */

/**
 * the CanvasRenderer is a Canvas​Rendering​Context2D or holds one: renderer.dom
 * 
 * 
 */

// set fill color
// set stroke color
// set stroke width


/** @type {HTMLCanvasElement} */
let cvs = null;

/** @type {Canvas​Rendering​Context2D} */
let ctx = null;


/**
 * 
 * @param {HTMLElement} _parent 
 */
const Create = function() {
    if (!cvs) {
        cvs = document.createElement("canvas");
        ctx = cvs.getContext('2d');
        cvs.style.width = "100%"
        cvs.style.height = "100%"
    }

    return {
        dom: cvs, 
        
        ctx,

        clear() {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
        },

        setStyle(_style) {
            Object.assign(ctx, _style);
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
        }
    }
};

// Note: after creation canvas width and heigt aren't valid yet.
// after appending it to it's parent it is (reason: 100% style)


module.exports = Create();
// export default CanvasRenderer;