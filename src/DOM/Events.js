import { checkObject } from "../Util/ParamCheck";

//=================================================================================
var __DEBUG__;

const EventOptions = {
    bubbles: false,
    cancelable: true
};

export const Type = {
    MOUNT: "mgMount",
    RATIO: "mgRatio",
    RATIO_DO: "mgRatioDo",
    RESIZE: "mgResize",
    SELECT: "mgSelect",
    SELECT_DO: "mgSelectDo",
};

export const trigger = (elem, evtName, data, options) => {
    let ev;
    if (data === undefined) {
        if(checkObject(options)) {
            ev = new Event(evtName);
        }
        else {
            ev = new Event(evtName, options);
        }
    }
    else {
        if (checkObject(options)) {
            options.detail = data;
        }
        else {
            options = { detail: data };
        }
        ev = new CustomEvent(evtName, options);
    }
    
    return elem.dispatchEvent(ev);
};



