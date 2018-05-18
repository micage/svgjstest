import Vector2 from "../../Math/Vector2";
import Vector3 from "../../Math/Vector3";
import Frame from "../../Entities/Frame";
import Camera from "../../Entities/Camera";
import Scene from "../../Entities/Scene";
import { PathEntity, Vertex } from "../../Entities/PathEntity";

import * as DOM from "../../DOM/Elements";
import * as Evt from "../../DOM/Events";
import ScrollBar from "../../DOM/ScrollBar";
import * as Obs from "../../Structures/Observable";
// import SVG from "svg.js";

// ======================================================================
// test svg.js
let views = {
    scrollBar: null,
    svg: null,
};

let G = {
    scene: null,
    g1_id: DOM.genId()
};

// observables
let obs = {
    k1: new Obs.ObservableRangedValue(0, -10, 10),
};

obs.k1.addListener(function() {
    G.scene.draw(this.value);
    Evt.trigger(views.scrollBar, "mgRatioDo", this.getRatio());
});

const textStyle = {
    "user-select": "none",
    "cursor": "default"
};

let root = null;
DOM.App(
    root = DOM.Div({
        id: "app",
        style: { 
            font: "12pt sans-serif"
        },
        children: [
            DOM.Div({
                id: "scene", 
                style: {
                    "height": "400px"
                },
                children: [
                    SVG({
                        style: {
                            width: "100%",
                            height: "100%"
                        },
                        viewBox: "0 0 50 30",
                        children: [Group({
                            id: G.g1_id,
                            style: {
                                transform: "matrix(1,0,0,-1,25,15)"
                            }
                        })]
                    })
                ]
            }),
            DOM.Span({ 
                text: "Vector2 Test - scroll and watch! Guess what's going on?", 
                style: textStyle
            }),
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
                text: "Green is const. Red is changing x. All others depend on Red and Green or the slider value",
                style: Object.assign({
                    "color": "#aaa",
                    "font-size": "10pt",
                }, textStyle)
            }),            
        ],
        listenTo: {
            mgMount: OnAppMounted
        }
    })
);

function OnAppMounted() {
    let g1 = document.getElementById(G.g1_id);
    G.scene = createScene(g1);
    
    obs.k1.value = -2; // this triggers the listener
}

const createScene = () => {
    let scene = new Scene();

    scene.camera.at = new Vector3(10, 6, 0);

    let p1 = new PathEntity({
        color: "dfdf30"
    });
    p1.addVertex({ x: 1, y: 2 });
    p1.addVertex({ x: 2, y: 2, z: 3 });
    p1.addVertex({ x: 2, y: 2, z: 7 });

    self.draw = function(k) {
        let ang = k / 10 * Math.PI;
        let R = 12;
        scene.camera.pos = new Vector3(R * Math.cos(ang), 6, R * Math.sin(ang));

        renderer.render(scene);

    };

    return self;
};



// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();

    // dispose handler
    module.hot.dispose(function () {
        // revoke the side effect
        root.remove();
    });
}
