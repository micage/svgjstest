import Vector2 from "../Math/Vector2";
import Vector3 from "../Math/Vector3";
import * as svg from "../svg/Elements";


const gStyle = {
    "fill": "orange",
    "stroke": "black",
    "stroke-width": "1"
};


/**
 * @class Line
 */
class Line {
    /**
     * @param {Object} params - 
     * - {Vector3} points - array of vectors
     * - {Object} style
     */
    constructor(params) {
        this.points = params.points || [new Vector3(), new Vector3(1,0,0)];
        if (this.points.length === 0) {
            this.points = [new Vector3(), new Vector3(1, 0, 0)];
        }
        else if (this.points.length === 1) {
            this.points[1] = this.points[0].plus(new Vector3(1, 0, 0));
        }

        this.path = svg.Path({
            "d": "M 100 100 L 300 100 L 200 300 z"
        });
        Object.assign(this.path.style, gStyle);
    }

    update(points2d) {
        var ddd = `M ${points2d[0].x} ${points2d[0].y} `;
        
        for (var i = 1; i < this.points2d.length; i++) {
            let p = points2d[i];
            ddd = `${ddd} L ${p.x} ${p.y}`;
        }
        ddd += ' z';

        this.path.setAttribute("d", ddd);
    }

    render() {

    }
}

export default Line;