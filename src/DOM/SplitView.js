import { checkBoolean, checkObject } from "../Util/ParamCheck";
import { split } from "./Split";
import { Div, checkCreationParams } from "./Elements";
import * as Evt from "./Events";

// @ts-ignore
import styles from "./SplitView.less"

/* TODO
- make thumb size proportional to visible/total ratio
- click on left/right or above/below of bar -> change ratio
- bug: split bar is vanishing is ratio gets to zero

*/

let _args;
let _TypeH = styles["h"];
let _TypeV = styles["v"];

const _Create = (args) => {
    _args = args;
    
    if (__DEBUG__) checkCreationParams(args)

    // this listener has to be added to the creation args (!)
    if (!checkObject(args.listenTo)) args.listenTo = {};
    args.listenTo["mgMount"] = function(ev) {
        console.log(`SplitView: ${ev.type} ${ev.target.className}`);
        split(self, args);
    };
    args.listenTo["mgRatio"] = function (ev) {
        console.log(`SplitView: ${ev.type} ${ev.target.className}`);
    };
    args.listenTo["mgResize"] = function (ev) {
        console.log(`SplitView: ${ev.type} ${ev.target.className}`);
        Evt.trigger(self, "mgRatioDo")
    };

    let self = Div(args);

    if (!checkBoolean(args.horizontal)) args.horizontal = true;
    self.classList.add(styles.splitview);
    self.classList.add(args.horizontal ? _TypeH : _TypeV);
    self.Type = "SplitView";

    return self;
};

export default _Create;
