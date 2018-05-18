import Scene from "../Entities/Scene";
import { SVG, Group, Circle, Rect, Path } from "../../SVG/Elements";
/**
 * This renderer is creating SVGElements
 * These are visible as soon as being created and persistent in the SVG-DOM
 * So once created they remain visible in opposite to canvas elements
 * 
 * Should we create the SVG root ourselves? Then we would only need a parent DIV
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
     * A scene is a tree of frames (coordinate systems)
     * @param {Scene} scene
     */
    render(scene) {
        scene.traverse(entity => {

        });
        console.log(scene);
    }

}

export default SVGRenderer;