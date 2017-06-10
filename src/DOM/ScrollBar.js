import { checkBoolean, checkObject } from "../Util/ParamCheck";
// import "../UI/Splitter";
import { split } from "../DOM/Split";
import { Div } from "./Elements";

// @ts-ignore
import styles from "./ScrollBar.less";

/* TODO
restore mgMount set by user, otherwise it will not be called
*/

//==================================================================
const _TypeH = styles["scrollBar-h"];
const _TypeV = styles["scrollBar-v"];

const _Create = (args) => {

    args.children = [
        Div({ class: "one" }),
        Div({ class: "two" }),
    ];

    let self = Div(args);
    if (!checkBoolean(args.horizontal)) args.horizontal = true;
    self.classList.add(args.horizontal ? _TypeH : _TypeV);
    self.Type = "ScrollBar";

    self.addEventListener("mgMount", function onMount(ev) {
        console.log(`ScrollBar: ${ev.type} ${ev.target.className}`);
        split(self, args);
    });

    return self;
};

export default _Create;
