import * as __ from "../../Util/ParamCheck";
import * as SVG from "../../svg/Elements";

// 1, 2, 3
function drawSign (x, y, c) {
    let width = 40;
    let height = 10;
    return SVG.Group({
        children: [
            SVG.Line({
                p0: { x, y },
                p1: { x: x + width, y: y + (c.a-1) * height }
            }),
            SVG.Circle({ cx: x, cy: y, r: 2 }),
            SVG.Circle({ cx: x + width, cy: y + (c.a-1) * height, r: 2 }),
            SVG.Line({
                p0: { x, y: y + height },
                p1: { x: x + width, y: y + (c.b-1) * height }
            }),
            SVG.Circle({ cx: x, cy: y + height, r: 2 }),
            SVG.Circle({ cx: x + width, cy: y + (c.b-1) * height, r: 2 }),
            SVG.Line({
                p0: { x, y: y + 2 * height },
                p1: { x: x + width, y: y + (c.c-1) * height }
            }),
            SVG.Circle({ cx: x, cy: y + 2 * height, r: 2 }),
            SVG.Circle({ cx: x + width, cy: y + (c.c-1) * height, r: 2 }),
    ]})
}

// dihedral 3
let d3 = {
    e: { a: 1, b: 2, c: 3 },
    r: { a: 2, b: 3, c: 1 },
    r2: { a: 3, b: 1, c: 2 }, // r2 * r = e, r2 = r^-1
    f1: { a: 1, b: 3, c: 2 },
    f2: { a: 3, b: 2, c: 1 },
    f3: { a: 2, b: 1, c: 3 }
};

let cayley = [
    [d3.e , d3.r,  d3.r2, d3.f1, d3.f2, d3.f3],
    [d3.r , d3.r2, d3.e,  d3.f2, d3.f3, d3.f1],
    [d3.r2, d3.e,  d3.r,  d3.f3, d3.f1, d3.f2],
    [d3.f1, d3.f3, d3.f2, d3.e,  d3.r,  d3.r2],
    [d3.f2, d3.f1, d3.f3, d3.r2, d3.e,  d3.r],
    [d3.f3, d3.f2, d3.f1, d3.r,  d3.r2, d3.e],
];

let table = function() {
    let out = [];
    cayley.forEach((w, j) => {
        cayley[j].forEach((v, i) => {
            out.push(drawSign((i + 1) * 70, 10 + j * 50, v));
        });
    });
    return out;
}

let svg = new SVG.SVG({
    viewBox: "0 0 1000 400",
    style: {
        stroke: "tomato", fill: "yellow"
    },
    children: table()
});

document.body.appendChild(svg);

// =================================================================
// Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
