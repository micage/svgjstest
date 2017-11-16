import * as SVG from "../svg/Elements";
import Scene from "../Entities/Scene";
/**
 * This renderer is creating SVGElements
 * These would be visible as soon as being created
 * 
 * Should we create the SVG root ourselves? THen we would only need a parent DIV
 */

class SVGRenderer {
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
    }

    createLine(points, style) {
        let line = {
            line: SVG.Line(points),
            style
        };
        return line;
    }

    /**
     * @param {Scene} scene
     */
    render(scene) {
        scene.traverse(entity => {

        });
        console.log(scene);
    }

}

export default SVGRenderer;