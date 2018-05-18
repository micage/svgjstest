global.__DEBUG__ = true;

/* TODO:
    Question: Merge Points? if a dragged Point is in closed vicinity to another Point
    Question: Close Path? if a dragged Point is first and in closed vicinity to last Point (or viceversa)
    make Point and CPoint draggables selectable
    use cursor keys to move selection
    Toolbar
        Button: toggle object/path mode
        Button

    Events:
    click: (ev) => {
        if (ev.target === svgDoc): {
        
        }
        else if (ev.target === Path): () => {
        
        }
        else if Point: () => {
            if without SHIFT clear selection
            add Point to selection
        }
        else if CPoint: () => {
            if without SHIFT clear selection
            add CPoint to selection
        }
        else if Line: () => {

        }
    }
    drag: 
            
*/

//==========================================
const ExpParser = require("../../Math/ExpressionParser");
const Vector3 = require("../../Math/Vector3.js");
const Matrix3x3 = require("../../Math/Matrix3x3.js");
const { SVG, Group, Rect, Path, Line } = require("../../svg/Elements");
const {Div, Span} = require("../../DOM/Elements");
const { PathEntity, Vertex } = require("../../Entities/PathEntity");
const { ObservableValue } = require("../../Structures/Observable");
const css = require("./main.less");

let root, // Div({ id: "app" })
    selection = [];

let model = {
    path: new PathEntity({
        vertices: [
            new Vertex({ pos: new Vector3(301, 151, 0) }), // t0 and t1 will not be used
            new Vertex({ pos: new Vector3(402, 82, 0), t0: new Vector3(252, 202, 0), t1: new Vector3(452, 202, 0) }),
            new Vertex({ pos: new Vector3(502, 53, 0), t0: new Vector3(353, 203, 0), t1: new Vector3(453, 53, 0) }),
        ],
        style: {
            stroke: "beige",
            strokeWidth: 2
        }
    })
};
let views = {
    svgDoc: null,
    path1: null,
    text1: null
};

// globals: window, for adding and removing global event listeners
// use it as a listener for the mousedown event
const dragListener = function(dragCB) {
    return function(ev) {
        let elem = ev.target;
        let x = ev.screenX, y = ev.screenY;
        const onMouseMove = function(ev) {
            let dx = ev.screenX - x,
                dy = ev.screenY - y;
            if (dragCB) {
                dragCB(elem, dx, dy);
            }
            x = ev.screenX;
            y = ev.screenY;
        };
        const onMouseUp = function(ev) {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };
};

// pure
const calcPath = function(p) {
    let M = p.getVertex(0).pos;
    let d = "M" + M.x.toFixed() + "," + M.y.toFixed() + " C";
    for (let i = 1; i < p.length; i++) {
        let vert = p.getVertex(i);
        d += (vert.t0.x.toFixed() + "," + vert.t0.y.toFixed() + " ");
        d += (vert.t1.x.toFixed() + "," + vert.t1.y.toFixed() + " ");
        d += (vert.pos.x.toFixed() + "," + vert.pos.y.toFixed() + " ");
    }
    if(p.isClosed) {
        d += "z";
    }
    return d;
};

// globals: views.svgDoc for scale transformation
const createDraggable = function(obsX, obsY, type) {
    let mn = views.svgDoc.viewBox.baseVal.width/(views.svgDoc.clientWidth);
    return Rect({ 
        x:  obsX.value - 3, y:  obsY.value - 3, 
        rx: type != "q" ? 3 : 1, ry: type != "q" ? 3 : 1, 
        width: 5, height: 5, 
        class: type != "q" ? css["cpoint"] : css["point"],
        listeners: {
            mousedown: dragListener(function(elem, dx, dy) {
                // also transform deltas from screen to client scale
                obsX.value += dx * mn;
                obsY.value += dy * mn;
                elem.x.baseVal.value = obsX.value - 3;
                elem.y.baseVal.value = obsY.value - 3; 
            }),
        },                
    });
};

const CPoint = function(args) {
    this.point = args.point || console.warn("CPoint ctor:no point given");
    this.view = Rect({ 
        x:  args.x - 3, y:  args.y - 3, 
        rx: 1, ry: 1, 
        width: 5, height: 5, 
        class: css["cpoint"],
        listeners: {
            mousedown: dragListener(onDrag),
            click: this.onClick
        },                
    });
};
CPoint.prototype = {
    onClick(ev) {

    },
    onDrag(elem, dx, dy) {

    }
};
const Point = function(args) {
    this.c1 = args.cpoint || console.warn("CPoint ctor:no c1 given");
    this.c2 = args.cpoint || console.warn("CPoint ctor:no c2 given");
    this.view = Rect({ 
        x:  args.x - 3, y:  args.y - 3, 
        rx: 3, ry: 3, 
        width: 5, height: 5, 
        class: css["point"],
        listeners: {
            mousedown: dragListener(onDrag),
            click: this.onClick
        },                
    });
};
Point.prototype = {
    onClick() {

    },
    onDrag(elem, dx, dy) {
        
    }
};

// globals: views.text1
const selectPath = function(svgPath) {
    if (selection.length) {
        return;
    }
    selection.push(svgPath);
    
    let grp = svgPath.parentElement.appendChild(Group({
        class: css["draggable"]
    }));
    svgPath.classList.add(css["selected"]);
    let arr = ["pos", "t0", "t1"];
    let verts = model.path._vertices, l1, l2, lines = [];   

    const updatePath = () => {
        let d = calcPath(model.path);
        svgPath.setAttribute("d", d);
        views.text1.innerHTML = d;
        for (let i = 0; i < model.path.length - 1; i++) {
            let line1 = lines[2*i], v0 = verts[i], v1 = verts[i+1];
            line1.setAttribute("x1", v0.pos.x); line1.setAttribute("y1", v0.pos.y);
            line1.setAttribute("x2", v1.t0.x);  line1.setAttribute("y2", v1.t0.y);
            let line2 = lines[2*i+1];
            line2.setAttribute("x1", v1.pos.x); line2.setAttribute("y1", v1.pos.y);
            line2.setAttribute("x2", v1.t1.x);  line2.setAttribute("y2", v1.t1.y);
        }
    };

    // create handles for path manipulation
    for (let i = 0; i < model.path.length; i++) {
        if (i < model.path.length - 1) {
            l1 = Line({
                class: css["line"],
                x1: verts[i].pos.x, y1: verts[i].pos.y,
                x2: verts[i+1].t0.x, y2: verts[i+1].t0.y,
            }); grp.appendChild(l1); lines.push(l1);
            l2 = Line({ 
                class: css["line"],
                x1: verts[i+1].pos.x, y1: verts[i+1].pos.y,
                x2: verts[i+1].t1.x, y2: verts[i+1].t1.y,
            }); grp.appendChild(l2); lines.push(l2);
        }
        for (let feat of arr) {
            let vf = verts[i][feat], d;
            if (feat != "pos" && i == 0) { // CPoints of first vertex aren't used
                continue;
            }
            grp.appendChild(createDraggable(
                new ObservableValue(vf.x, (v) => {
                    vf.x = v;
                    updatePath(model.path);
                }),
                new ObservableValue(vf.y, (v) => {
                    vf.y = v;
                    updatePath(model.path);
                }),
                feat == "pos" ? "" : "q"
            ));
        }
    }
};

const select = function(ev) {
    if (ev.target.tagName === "path") {
        selectPath(ev.target);
    }
    else if(ev.target.tagName === "svg" && selection.length) {
        selection[0].classList.remove(css["selected"]);
        let g = selection[0].parentElement;
        g.children[1].remove();
        selection = [];
    }


};

const addVertex = () => {
    let verts = model.path._vertices;
    verts.push(verts[verts.length-1].clone()); // duplicate last vertex
    select({ target: views.svgDoc });
};

(() => {
    let out, str, text; 
    console.log("");

    views.svgDoc = SVG({
        viewBox: "200 0 800 500", id: "SVG1",
        class: css["doc"],
        listeners: { click: (ev) => { select(ev); } },
        children: [
            Rect({
                class: css["button"],
                x: 10, y: 10, 
                rx: 4, ry: 4,
                listeners: { click: (ev) => { addVertex(ev); } },
            }),
            Group({
                children:[
                    views.path1 = Path({
                        d: calcPath(model.path),
                        class: css["path"],
                        listeners: {
                            click: function(ev) {
                                selectPath(ev.target);
                            }
                        }
                    })
                ]
            })
        ],
    });

    document.body.appendChild(root = Div({
        id: css["app"],
        children: [
            views.svgDoc,
            Div({
                children: [
                    views.text1 = Span({
                        text: calcPath(model.path)
                    })
                ],
                style: {
                    position: "absolute", top: "20px", right: "200px", color: "beige"
                },
            })
        ]
    }));
})();


// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();

    // dispose handler
    module.hot.dispose(function () {
        // revoke the side effect
        root.remove();
    });
}
