import Vector2 from "./Math/Vector2";
import * as DOM from "./DOM/Elements";
import ScrollBar from "./DOM/ScrollBar";
import * as Obs from "./Structures/Observable";
import SVG from "svg.js";

// ======================================================================
// test svg.js
let obs = {
    k1: new Obs.ObservableRangedValue(0, -10, 10),
}
obs.k1.addListener(function() {
    drawScene(this.value)
});

DOM.App(
    DOM.Div({
        children: [
            DOM.Div({
                id: "scene", style: {
                    "height": "400px"
                }
            }),
            ScrollBar({
                style: { width: "300px", height: "20px", border: "1px solid #ddd" },
                listenTo: {
                    mgRatio: (ev) => {
                        obs.k1.setFromRatio(ev.detail);
                    }
                }
            })
        ],
        listenTo: {
            mgMount: () => {
                obs.k1.value = 7;
            }
        }
    })
);

var svg = SVG('scene');
svg.viewbox(0, 0, 50, 30);
var g1 = svg.group();
g1.move(20, 15).scale(1, -1);

const DrawVector = (v, from, color) => {
    let l = g1.line(0, 0, v.x, v.y);
    if (from) {
        l.dmove(from.x, from.y);
    }
    l.stroke({ width: 0.1, color });
    return l;
}


const drawScene = (k) => {
    let a = new Vector2(2 * k, 3);
    let b = new Vector2(5, 13);
    let c = a.dot(b);
    let d = (new Vector2(10,0)).rotate(-k*18, true);

    g1.clear();
    g1.circle(k + 10).move(-(k + 10)/2, -(k + 10)/2).fill('none').stroke({ width: 0.1, color: "#eee" })

    g1.text("Hallo Du da.").move(0,0);

    DrawVector(a, 0, "red");
    DrawVector(b, 0, "lightgreen");

    DrawVector(a.split(b).coll, 0, "#f6f");
    DrawVector(a.split(b).perp.inv, a, "cornflowerblue");

    let amb = a.mirror(b)
    DrawVector(amb, 0, "#777");

    DrawVector(amb.split(b).coll, 0, "#f6f");
    DrawVector(amb.split(b).perp.inv, amb, "cornflowerblue");
    
    DrawVector(d, 0, "tomato");
};



// ======================================================================

if (module.hot) {
    module.hot.accept();
}