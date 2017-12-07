import Frame from "./Frame";
import Vector3 from "../Math/Vector3";
import Vector2 from "../Math/Vector2";

/**
 * every Entity has a life cycle: init, update, destroy
 */

class Camera {
    constructor(params) {
        if(__DEBUG__) {
            if(!params) {
                params = {};
                console.warn("no camera params specified.");
            }
        }
        let frameParams = {
            pos: params.pos || new Vector3(0, 8, 6),
            at: params.at || new Vector3(),
            d: params.d || 10
        };
        this.d = params.d > 1 ? params.d : 10; 
        this.frame = new Frame(frameParams);
    }

    project(v) {
        // v.z should be clipped to <z.near, z.far>
        let s = this.d / (v.z);
        return new Vector2(v.x * s, v.y * s);
    }

    /**
     * @param {Frame} frame - root frame of the hierarchy to be rendered
     * 
     * time frame of the camera has to match the time interval of the objects
     * 
     * 
     */
    render(frame) {
        let ent = frame.entity; // get the entity attached to the frame
        
        // this has to come from a frame stack
        // and should contain a model to world transformation
        // in absence of a hierarchy this boils down to be 
        // the identity
        let wtm = null;
        
        if (ent) ent.lines.forEach((line) => {
            line.render(this, wtm);
        });

    }

}

export default Camera;


