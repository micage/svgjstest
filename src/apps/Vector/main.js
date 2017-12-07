import CreateApp from "./appVector2Test";
import { App, mount } from "../../DOM/Elements";

let app = CreateApp();
App(app);
// mount();

// ======================================================================
if (module.hot) {
    module.hot.accept('./appVector2Test.js', function () {
        document.body.removeChild(app);
        app = require("./appVector2Test").default();
        App(app);
        mount();

        console.log('module.hot.accept');
    });
}