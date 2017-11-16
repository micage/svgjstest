import * as __ from "../Util/ParamCheck";

import ObjectTree from "../Structures/ObjectTree";
import { NodePrinter } from "../Structures/ObjectTree";

import { parseString } from "xml2js";

// var pathSegmentPattern = /[a-z][^a-z]*/ig;

// ===========================================================================

/** @export
 * @param {string} - an XML file as a string
 * @return {Object} - object literal, hierarchy of svg groups and objects
 */
export const parseSVG = file => {
    let result = null;
    let err = null;

    parseString(file, (_err, _result) => {
        result = _result;
        err = _err;
    });

    let self = {}
    if (! err) {
        parse(self, result);
    }

    return self;
}

// ===========================================================================

// private functions

const parse = (trgtParentNode, srcNode) => {
    if (__.checkObject(srcNode)) {
        Object.keys(srcNode).forEach(key => {
            switch (key) {
                case "svg": parse(trgtParentNode, srcNode[key]); break;
                case "$": trgtParentNode = parseAttr(trgtParentNode, srcNode[key]); break;
                case "g": parseGroups(trgtParentNode, srcNode[key]); break;
                case "path": parsePathes(trgtParentNode, srcNode[key]); break;
                case "rect": parseRects(trgtParentNode, srcNode[key]); break;
                case "circle": parseCircles(trgtParentNode, srcNode[key]); break;
                case "text": parseTexts(trgtParentNode, srcNode[key]); break;
                case "line": parseLines(trgtParentNode, srcNode[key]); break;
                case "polyline": parsePolyLines(trgtParentNode, srcNode[key]); break;
                case "type": 
                    ((a) => {
                        trgtParentNode.type = srcNode[a];
                        console.log('type: ' + srcNode[a]);                        
                    })(key);
                    break;
                default: parseElements(trgtParentNode, srcNode[key]);
            }
        });
    }
    else if (__.checkArray(srcNode)) { // array of objects

    }
    else { // it's a string {

    }
};

let unknownCouter = 0;

const parseElements = (parentNode, elems) => {
    if (__.checkArray(elems)) {
        elems.forEach(elem => {
            parse(parentNode, elem);
        })
    }
};

const parseAttr = (parentNode, attr) => {
    if (!__.checkObject(attr)) {
        return;
    }

    let id = attr.id;
    let key = null;
    if (__.checkString(id)) {
        key = id;
    }
    else {
        key = "unknown" + unknownCouter;
        unknownCouter++;
    }
    parentNode[key] = {};
    let aaa = parentNode[key];
    aaa.attr = {};
    Object.assign(aaa.attr, attr);
    delete aaa.attr.id;

    return parentNode[key];
}

const _parseSVG = (parentNode, svg) => {
    if (!__.checkObject(svg)) {
        return;
    }
    parse(parentNode, svg);
    parentNode = parentNode.svg;
};

const parseGroups = (parentNode, groups) => {
    if (__.checkArray(groups)) {
        groups.forEach(g => {
            g.$.type = "g";
            // g.type = "g";
            parse(parentNode, g);
        })
    }
};

const parsePathes = (parentNode, pathes) => {
    if (__.checkArray(pathes)) {
        pathes.forEach(path => {
            path.$.type = "path";
            // path.type = "path";
            parse(parentNode, path);
        })
    }
};

const parseRects = (parentNode, rects) => {
    if (__.checkArray(rects)) {
        rects.forEach(rect => {
            rect.$.type = "rect";
            // rect.type = "rect";
            parse(parentNode, rect);
        })
    }
};

const parseCircles = (parentNode, circles) => {
    if (__.checkArray(circles)) {
        circles.forEach(circle => {
            circle.$.type = "circle";
            // circle.type = "circle";
            parse(parentNode, circle);
        })
    }
};

const parseTexts = (parentNode, texts) => {
    if (__.checkArray(texts)) {
        texts.forEach(text => {
            text.$.type = "text";
            parse(parentNode, text);
        })
    }
};

const parseLines = (parentNode, lines) => {
    if (__.checkArray(lines)) {
        lines.forEach(line => {
            parse(parentNode, line);
            line.$.type = "line";
        })
    }
};

const parsePolyLines = (parentNode, lines) => {
    if (__.checkArray(lines)) {
        lines.forEach(line => {
            parse(parentNode, line);
            line.$.type = "polyline";
        })
    }
};

//export { parseSVG };