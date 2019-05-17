/**
 * every Entity has a life cycle: init, update, destroy
 * 
 * Entities are built from 3d-primitives like box, sphere, line, polyline, ...
 * 
 */

const IEntity = function() {};

IEntity.prototype = {
    getName() { debugger; },
    getFrame() { debugger; return null; },
    update(frame, t, dt) { debugger },
    render(frame, renderer) { debugger },
};

module.exports = IEntity;