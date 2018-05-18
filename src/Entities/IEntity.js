/**
 * every Entity has a life cycle: init, update, destroy
 * 
 * Entities are built from 3d-primitives like box, sphere, line, polyline, ...
 * 
 */

const IEntity = function() {};

IEntity.prototype = {
    init() {},
    update(t, dt) {},
    destroy() {},

    get frame() { return null; },
    get lines() { return null; },
    get pathes() { return null; },
};

module.exports = IEntity;