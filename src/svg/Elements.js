import * as __ from "../Util/ParamCheck";
import {
    applyStyle,
    appendChildren,
    addClasses,
    addListeners
} from "../DOM/Elements";
import Vector2 from "../Math/Vector2";


const svgNS = "http://www.w3.org/2000/svg";
const svgLink = "http://www.w3.org/1999/xlink";

/**
 * Since props are applied as attributes we cannot use DOM/Elements.CopyProps
 * have to guard against copying props that are attributes which are read-only
 * like e.g. cx for a circle
 * @param {SVGElement} elem 
 * @param {Object} props 
 */
const CopyProps = (elem, props) => {
    if (__DEBUG__) {
        if (!(elem instanceof SVGElement)) throw Error("args is not an Object");
        if (!__.checkObject(props)) throw Error("args is not an Object");
    }
    Object.keys(props).forEach(prop => {
        let isAttr = props.attr && props.attr.some(entry => entry === prop);
        if (!isAttr) {
            elem[prop] = props[prop];
        }
    });
};

const Create = (args) => {
    let elem = document.createElementNS(svgNS, args.Type);
    
    // Note: this is not sufficient for checking the interface
    if (args.class) addClasses(elem, args.class); delete args.class;
    if (args.style) applyStyle(elem, args.style); delete args.style;
    if (args.children) appendChildren(elem, args.children); delete args.children;
    if (args.listeners) addListeners(elem, args.listeners); delete args.listeners;
    if (args.transform) {
        elem.setAttribute("transform", args.transform);
        delete args.transform;
    }
    // CopyProps(elem, args);

    return elem;
};

const SVG = (args) => {
    if (!__.checkObject(args)) args = {};

    args.Type = "svg";
    args.attr = ["xmlns:xlink", "viewBox"];

    let self = Create(args);

    self.setAttribute('xmlns:xlink', svgLink);
    if (args.viewBox) self.setAttribute('viewBox', args.viewBox);

    return self;
};

const Group = (args) => {
    if (!__.checkObject(args)) args = {};
    args.Type = "g";
    let self = Create(args);

    self.line = function(args) { this.appendChild(Line(args)); }
    self.polyline = function(args) { this.appendChild(Line(args)); }

    return self;
};

/**
 * @param {Object} args - creation params
 *  - {Vector2} p0 - first point
 *  - {Vector2} p1 - second point
 *  - {number} x1 - obsolete if points are given
 *  - {number} y1 - obsolete if points are given
 *  - {number} x2 - obsolete if points are given
 *  - {number} y2 - obsolete if points are given
 *  - {string} id
 *  - {Object} style - CSS in JSON format, e.g. { "stroke" : "yellow", "stroke-width": "2" }
 *  - {string} className - CSS className
 */
const Line = (args) => {
    if (!__.checkObject(args)) {
        console.warn("No arguments given for Line(...)");
        args = {};
    }
    if (__.checkArray(args.children)) {
        console.warn("Children in SVGLineElement are not allowed.");
        delete args.children; // no children allowed
    }
    
    args.Type = "line";
    let self = Create(args);

    if (args.p0 && args.p1) {
        self.setAttribute("x1", p0.x || 0);
        self.setAttribute("y1", p0.y || 0);
        self.setAttribute("x1", p1.x || 0);
        self.setAttribute("y1", p1.y || 0);
        delete args.p0;
        delete args.p1;
    }
    else {
        self.setAttribute("x1", args.x1);
        self.setAttribute("y1", args.y1);
        self.setAttribute("x2", args.x2);
        self.setAttribute("y2", args.y2);
    }

    return self;
};

const PolyLine = (args) => {
    let pointsTypeIsArray = 0;
    if (__DEBUG__) {
        if (!__.checkObject(args)) args = {};
        if (!__.checkString(args.points)) {
            if (!__.checkArray(args.points)) {
                args.points = "0,0 10,0";
            } else {
                pointsTypeIsArray = 1; // of Vector2
            }
        } 
    }
    
    args.Type = args.bIsClosed === true ? "polygon" : "polyline";

    let self = Create(args);
    
    if (pointsTypeIsArray) {
        let points = args.points;
        if (points.length === 0) {
            points = [new Vector2(), new Vector2(1, 0, 0)];
        }
        if (points.length === 1) {
            points.push(points[0].plus(new Vector2(1, 0, 0)));
        }
        
        points = points.map(p => p.x + "," + p.y + " ").join(" ");
    }
    
    // no validity check if it's a string
    // also no check if it's really an array of Vector2
    self.setAttribute("points", args.points);   

    return self;
};

const Circle = (args) => {
    if (!__.checkObject(args)) {
        console.warn("No arguments given for Cirle(...)");
        args = {};
    }
    if (__.checkArray(args.children)) {
        console.warn("Children in SVGCircleElement are not allowed.");
        delete args.children; // no children allowed
    }
    
    args.Type = "circle";
    args.attr = ["cx", "cy", "r"]
    let self = Create(args);

    // set read only props as attributes
    self.setAttribute("cx", __.checkNumber(args.cx) ? args.cx : 10);
    self.setAttribute("cy", __.checkNumber(args.cx) ? args.cy : 10);
    self.setAttribute("r", __.checkNumber(args.r) ? args.r : 10);

    return self;
};

const Rect = (args) => {
    if (!__.checkObject(args)) {
        console.warn("No arguments given for Rect(...)");
        args = {};
    }
    if (__.checkArray(args.children)) {
        console.warn("Children in SVGRectElement are not allowed.");
        delete args.children; // no children allowed
    }
    
    
    args.Type = "rect";
    args.attr = ["x", "y", "rx", "ry", "width", "height"];
    let self = Create(args);

    // set read only props as attributes
    self.setAttribute("width", args.width || 10);
    self.setAttribute("height", args.height || 10);
    self.setAttribute("x", args.x || 10);
    self.setAttribute("y", args.y || 10);
    self.setAttribute("rx", args.rx || 0);
    self.setAttribute("ry", args.ry || 0);

    return self;
};

const Path = (args) => {
    if (!__.checkObject(args)) {
        console.warn("No arguments given for Path(...)");
        args = {};
    }
    if (__.checkArray(args.children)) {
        console.warn("Children in SVGPathElement are not allowed.");
        delete args.children; // no children allowed
    }
    
    args.Type = "path";
    args.attr = ["d", "transform"]
    let self = Create(args);
    
    self.setAttribute("d", args.d || "M 10,10 L 20,20");
    if (args.transform) {
        self.setAttribute("transform", args.transform);
    }

    return self; 
};

export { SVG, Group, Circle, Rect, Path, Line, PolyLine };