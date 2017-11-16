import Frame from "./Frame";
import Vector3 from "../Math/Vector3";

/**
 * every Entity has a life cycle: init, update, destroy
 * 
 * Entities are built from 3d-primitives like box, sphere, line, polyline, ...
 */

class Entity {
    constructor() {
        this.frame = new Frame();
        this.lines = [];
    }

    /**
     * place to actually create some geometry: 
     * - points, 
     * - lines, polylines
     * - grids
     * 
     * @param {} any - sdfsdf
     */
    init() {

    }

    update() {

    }

    /**
     * purge all things created
     */
    destroy() {

    }

    get lines() {
        return [
            { color: "#fa4", points: [Vector3(0,0,0), Vector3(10,10,10)] },
            { color: "#af4", points: [Vector3(0,0,0), Vector3(-10,10,10)] },
        ];
    }

    addLine() {

    }

    get faces() {

    }
}

export default Entity;