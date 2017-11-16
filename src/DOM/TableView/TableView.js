import * as __ from "../../Util/ParamCheck";
import pug from "pug-loader!./TableView.pug";
import "./TableView.less";

// test data
var data = {
    columns: ["id", "name", "tree type (german)", "val 1", "val 2"],
    rows: [
        [0, "Heinz", "Birke", 0.12, 13],
        [1, "Gabi", "Eiche", 0.22, 23],
        [2, "Bernd", "Kiefer", 0.32, 33],
        [3, "Lara", "Erle", 0.42, 43],
    ]
};

const onMount = function (ev) {
    console.log("TableView mounted: " + ev.target.className);

    // flex-box initially arranged our lists, now enable manual adjustment
    // this is done by adding ".then" style to the table, which disables flex
    let rulers = document.querySelectorAll(".ruler");
    for (let i = 0; i < rulers.length; i++) {
        let ruler = rulers.item(i);
        let lb = ruler.parentElement; // a list-box

        lb.style["width"] = lb.clientWidth + "px"; // 'bake' width into list-box
    }
    document.querySelector(".table").classList.add("then");

    // add drag listeners to all rulers
    for (let i = 0; i < rulers.length; i++) {
        let ruler = rulers.item(i);

        ruler.addEventListener("mousedown", function (ev) {
            console.log("mouse down " + i);

            let ruler = ev.target;
            let lb = ruler.parentElement;
            let mm, mmOptions = { capture: true };
            let mu, muOptions = { once: true };

            window.addEventListener("mousemove", mm = function mm(ev) {
                lb.style.width = `${ev.pageX - lb.offsetLeft}px`;
            }, mmOptions);

            window.addEventListener("mouseup", mu = function (ev) {
                window.removeEventListener("mousemove", mm, mmOptions);
                window.removeEventListener("mouseup", mu, muOptions);
                console.log("mouse up " + i);
            });
        });
    }

};

export default function (args) {
    if (__DEBUG__) {
        let error = [];
        if (!__.checkObject(args)) {
            args = {};
            error.push("no arguments");
        } else if (!__.checkObject(args.data)) {
            error.push("no data");
        } else {
            if (!__.checkArray(args.data.columns) || !args.data.columns.length) {
                error.push("no columns");
            }
            if (!__.checkArray(args.data.rows) || !args.data.rows.length) {
                error.push("no rows");
            }
        }
        if(!!error.length) {
            args.data = data;
            console.warn("TableView: " + error.join(", ") + ", taking test data");
        }
    }

    let self = document.createElement("div");
    self.classList.add("table-wrapper");
    self.innerHTML = pug({ data: args.data });
    self.addEventListener("mgMount", onMount, { once: true });

    return self;
}

