
import Icon from "../svg/Icon";
import { Span } from "./Elements";
import styles from "./Button.less";

/**
 * @param {Object} args - create params
 * @param {String} args.iconName - name of icon
 * @param {Function} args.action - click event handler
 */
const Create = (args) => {

    let self = Span({
        id: args.id,
        class: args.style || styles['button'], // default style
        listenTo: {
            click: (ev) => {
                // console.log("clicked, but no action has been specified.");
                args.action(ev.currentTarget);
            }
        },
        children: [ Icon({ name: args.iconName }) ]
    });

    return self;
};

export default Create;
