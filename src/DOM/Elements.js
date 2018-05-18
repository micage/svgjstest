import * as __ from "../Util/ParamCheck";
import * as Evt from "./Events";

//=================================================================================

const _Element = {
    id: String,
    class: String,
    style: { "css-rule": "value" },
    type: String,
    props: Object,
    children: [] // of HTMLElement
};

export const genId = () => "id" + Math.random().toString().slice(2);
export const genClassId = () => "cls" + Math.random().toString().slice(2);

export const checkCreationParams = (args) => {
    if (!__.checkObject(args)) { throw (`SplitView: no arguments provided`); }
    if (args.id && !__.checkString(args.id)) { throw ("not a string") }
    if (args.class && !__.checkString(args.class)) { throw ("not a string") }
    if (args.attr && !__.checkObject(args.attr)) { throw ("not an object") }
    if (args.listeners && !__.checkObject(args.listeners)) { throw ("not an object") }
    if (args.style && !__.checkObject(args.style)) { throw ("not an object") }
    if (args.children && !__.checkArray(args.children)) { throw ("not an array") }
    if (args.text) {
        if (!__.checkString(args.text)) {
            console.error("Div: text is not a string.");
        }
        else if (args.Type === "div") {
            console.warn("Div: unwrapped text. Children will get omitted.");
        }
    }
    let rest = Object.keys(args).filter(k => !(
        k == "id" || k == "class" || k == "attr" || k == "Type" || k == "text" ||
        k == "listeners" || k == "style" || k == "children" || k == "listenTo"
    ));
    if (rest.length) {
        console.warn("redundant properties in args: " + rest.join(", "));
    }
}

export const forParents = (elem, untilElem, cb, cbFilter) => {
    let parent = elem;
    while ((parent = parent.parentElement) && parent !== untilElem) {
        if (cbFilter && !cbFilter(parent)) {
            continue;
        }
        else {
            cb(parent);
        }
    }
}

export const getParents = (elem, untilElem) => {
    let parents = [];
    forParents(
        elem,
        untilElem || document.body,
        (parent) => parents.push(parent)
    );
    return parents;
}

export const appendChildren = (node, children) => {
    if (__DEBUG__) {
        if (!(node instanceof Element)) throw Error("node is not an Element");
        if (!__.checkArray(children)) throw Error("children is not an array");
    }
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        try {
            node.appendChild(child);
        } catch (e){
            console.error(e.message + ": " + (node.id || node.constructor.name));
        };
    }
};

export const applyStyle = (node, style) => {
    if (__DEBUG__) {
        if (!(node instanceof Element)) {
            throw Error("node is not an Element");
        }
        if (!__.checkObject(style)) {
            throw Error("style is not an object");
        }
    }

    Object.keys(style).forEach(rule => {
        node.style[rule] = style[rule];
    });
};

export const addClasses = (elem, classStr) => {
    if (__DEBUG__) {
        if (!(elem instanceof Element)) throw Error("Elements: elem is not an Element");
        if (!__.checkString(classStr)) throw Error("Elements: classStr is not a string");
    }

    let list = classStr.split(' ');
    list.forEach(_class => { elem.classList.add(_class); });
};

const setAttributes = (elem, attrs) => {
    if (__DEBUG__) {
        if (!(elem instanceof Element)) throw Error("Elements: elem is not an Element");
        if (!__.checkObject(attrs)) throw Error("Elements: props is not an Object");
    }
    Object.keys(attrs).forEach(attr => {
        if (__DEBUG__) {
            if (attr === "class" && attr === 'children' && attr === 'style' && attr === 'listenTo') {
                throw Error("Elements: attrs should not contain: class|children|style|listenTo")
            }
        }
        
        elem[attr] = attrs[attr];
    });
};

export const addListeners = (elem, listeners) => {
    if (__DEBUG__) {
        if (!(elem instanceof Element)) throw("Elements: noelemde is not an Element");
        if (!__.checkObject(listeners)) throw("Elements: listeners is not an Object");
    }
    Object.keys(listeners).forEach(key => {
        elem.addEventListener(key, listeners[key]);
    });
};

const Create = (args) => {
    if (__DEBUG__) { checkCreationParams(args) }
    let elem = document.createElement(args.Type);
    if(__DEBUG__) {
        if (elem instanceof HTMLUnknownElement) {
            throw ("Unknown Element");
        }
    }

    if (args.id) elem.id = args.id;
    if (args.class) addClasses(elem, args.class);
    if (args.style) applyStyle(elem, args.style);
    if (args.children) appendChildren(elem, args.children);
    if (args.listenTo) addListeners(elem, args.listenTo);
    if (args.attr) setAttributes(elem, args.attr);
    if (args.text) elem.innerText = args.text;

    return elem;
};

// traverse the DOM via breadth-first and send a "mgMount" message to each element 
export const mount = () => {
    let stack = [document.body];
    let stackIndex = 0;
    let elem;

    while (elem = stack[stackIndex]) {
        let children = elem.children;
        
        for (let i = 0; i < children.length; i++) {
            let child = children.item(i);
            stack.push(child);
        }
        
        stackIndex++;
    }
    // mount elements in reverse order, root at last
    stack.reverse().forEach((elem) => {
        Evt.trigger(elem, Evt.Type.MOUNT);
        // console.log(`mount: ${elem.tagName}, ${elem.id}, ${elem.className}`);
    });

    console.log(`DOM fully loaded and parsed. Elements: ${stackIndex - 1}`);
};

/**
 * An App is a function of it's modules
 */
export const App = (elem) => {
    document.body.appendChild(elem);
    
    // if (args.class) addClasses(elem, args.class); delete args.class;
    // if (args.style) applyStyle(elem, args.style); delete args.style;
    // if (args.children) appendChildren(elem, args.children); delete args.children;
    // if (args.listenTo) addListeners(elem, args.listenTo); delete args.listenTo;
    // copyProps(elem, args);

    document.addEventListener("DOMContentLoaded", mount, false);
};

export const Div = (args) => {
    args.Type = 'div';
    return Create(args);
};
export const Group = Div;

export const Span = (args) => {
    let _args = args || {};
    _args.Type = 'span';

    return Create(_args);
};

export const P = (args) => {
    let _args = args || {};
    _args.Type = 'p';

    return Create(_args);
};

export const A = (args) => {
    let _args = args || {};
    _args.Type = 'a';

    return Create(_args);
};

export const Button = (args) => {
    let _args = args || {};
    _args.Type = 'button';

    return Create(_args);
};

export const Img = (args) => {
    let _args = args || {};
    _args.Type = 'img';

    return Create(_args);
};

export const Pre = (args) => {
    let _args = args || {};
    _args.Type = 'pre';

    return Create(_args);
};

export const Input = (args) => {
    let _args = args || {};
    _args.Type = 'input';

    return Create(_args);
};

export const TextArea = (args) => {
    let _args = args || {};
    _args.Type = 'textarea';

    return Create(_args);
};

export const ListItem = (args) => {
    if(!__.checkObject(args)) args = {};
    args.Type = 'li';
    return Create(args);
};

export const OrderedLists = (args) => {
    if (!__.checkObject(args)) args = {};
    args.Type = 'ol';
    return Create(args);
};

export const UnorderedList = (args) => {
    if (!__.checkObject(args)) args = {};

    args.Type = 'ul';
    return Create(args);
};

