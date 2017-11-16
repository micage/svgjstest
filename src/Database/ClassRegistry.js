/*
ClassRegistry: this holds information about all persistant classes
It's a singleton. Means that all modules refer to the same instance.

So, what is it good for?

Informations about a class are stored here:
    className
    props: [ {name, dataType} ]
 */

import * as __ from '../Util/ParamCheck';
import DB from './FakeDB';


let classes = {};

const ClassRegistry = function () {
};

ClassRegistry.prototype.register = function(theClass) {
    // check if class is already registered
    if (!classes[theClass.name]) {
        classes[theClass.name] = theClass.props;
    }
    else {
        console.warn(`class $(theClass.name) is already registered.`);
    }
};



const singleton = new ClassRegistry();
export default singleton;