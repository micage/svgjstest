import Vector2 from "./Math/Vector2";
import * as DOM from "./DOM/Elements";
import * as Evt from "./DOM/Events";
import ScrollBar from "./DOM/ScrollBar";
import * as Obs from "./Structures/Observable";
import SVG from "svg.js";

// ======================================================================
// test svg.js
let views = {
    scrollBar: null,
    svg: null,
    g1: null
};

// observables
let obs = {
    k1: new Obs.ObservableRangedValue(undefined, -10, 10),
};

obs.k1.addListener(function() {
    drawScene(this.value);
    Evt.trigger(views.scrollBar, "mgRatioDo", this.getRatio());
});

const textStyle = {
    "user-select": "none",
    "cursor": "default"
};

export default
function CreateApp() {
    return DOM.Div({
        id: "app",
        style: { font: "12pt sans-serif" },
        children: [
            DOM.Div({
                id: "scene", style: {
                    "height": "400px"
                }
            }),
            DOM.Span({ innerText: "Vector2 Test - scroll and watch! Guess what's going on?", style: textStyle }),
            views.scrollBar = ScrollBar({
                style: {
                    "width": "400px", 
                    "height": "20px", 
                    "border": "1px solid #ddd",
                    "margin": "8px 0 4px"
                },
                listenTo: {
                    mgRatio: (ev) => {
                        obs.k1.setFromRatio(ev.detail);
                    }
                }
            }),
            DOM.Span({
                innerText: "Green is const. Red is changing x. All others depend on Red and Green or the slider value",
                style: Object.assign({
                    "color": "#aaa",
                    "font-size": "10pt",
                }, textStyle)
            }),            
        ],
        listenTo: {
            mgMount: OnAppMounted
        }
    });
}

function OnAppMounted() {
    views.svg = SVG('scene').viewbox(0, 0, 50, 30);
    views.g1 = views.svg.group().move(20, 15).scale(1, -1);
    obs.k1.value = -2;
}


const DrawVector = (v, from, color) => {
    let l = views.g1.line(0, 0, v.x, v.y);
    if (from) {
        l.dmove(from.x, from.y);
    }
    l.stroke({ width: 0.15, color });
    return l;
}

//let text = views.svg.text("SVG Rocks!").scale(.075).y(-150).font({ size: 24, fill: "#bbb" });

const drawScene = (k) => {
    let a = new Vector2(2 * k, 3);
    let b = new Vector2(5, 13);
    let c = a.dot(b);
    let d = (new Vector2(10, 0)).rotate(-(k + 10) * 18, true);

    views.g1.clear();
    views.g1.circle(k + 10).move(-(k + 10)/2, -(k + 10)/2).fill('none').stroke({ width: 0.1, color: "#eee" })
    //text.x(30*k-300);

    DrawVector(a, 0, "red");
    DrawVector(b, 0, "lightgreen");

    DrawVector(a.split(b).coll, 0, "#f6f");
    DrawVector(a.split(b).perp.inv, a, "cornflowerblue");

    let amb = a.mirror(b)
    DrawVector(amb, 0, "#baa");

    DrawVector(amb.split(b).coll, 0, "#f6f");
    DrawVector(amb.split(b).perp.inv, amb, "cornflowerblue");
    
    DrawVector(d, 0, "orange");
};



// ======================================================================
// if (module.hot) {
//     module.hot.accept();
// }