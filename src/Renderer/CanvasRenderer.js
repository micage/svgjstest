

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
 * the CanvasRenderer is a HTMLCanvasElement2d
 */

const CanvasRenderer  = function() {

    drawLine(_from, _to) {
        
    }

    setStyle() {

    }

    drawBox() {

    }
}

export default CanvasRenderer;