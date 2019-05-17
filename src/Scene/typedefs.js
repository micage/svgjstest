/** @typedef { import("../Math/Vector3") } Vector3 */


/**
 * @typedef {Object} InterPolType
 * @property {number} id
 * @property {string} name
 */


/**
 * @typedef {Object} Vertex
 * @property {Vector3} pos 
 * @property {Vector3} t0 
 * @property {Vector3} t1 
 * @property {InterPolType} type
 */


/**
 * @typedef {Object} PathParams
 * @property {string} name
 * @property {Vertex[]} [vertices]
 * @property {string} [style]
 * @property {boolean} [isClosed]
 */


/**
 * @typedef {Object} IEntity
 * @property {() => string} getName
 * @property {() => Frame} [xxx]
 * @property {(t: number, dt: number) => void} update
 * @property {(R: IRenderer) => void} render
 */


/**
 * @typedef {Object} FrameParams
 * @property {string} [name]
 * @property {Vector3} [pos]
 * @property {Vector3} [target]
 */

/**
 * @typedef {(frame: IFrame) => boolean} FrameVisitFunc
 */

/**
 * @typedef {Object} IFrame
 * @property {() => string} getName
 * @property {() => Vector3} getPosition
 * @property {(v: Vector3) => void} setPosition
 * @property {() => Quaternion} getOrientation
 * @property {(q: Quaternion) => void} setOrientation
 * @property {(v: Vector3) => void} setTarget
 * @property {(s: string) => boolean} attach
 * @property {(s: string) => boolean} detach
 * @property {(visitor: FrameVisitFunc) => boolean} traverse
 */


/**
 * @typedef {Object} CameraParams
 * @property {string} name
 * @property {number} [dist] - focal distance
 */

/**
 * @typedef {Object} ICamera
 * @property {() => number} getFocalDistance
 * @property {(d: number) => void} setFocalDistance
 */