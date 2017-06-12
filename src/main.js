import CreateApp from "./app";
import { App, mount } from "./DOM/Elements";

let app = CreateApp();
App(app);

// ======================================================================
if (module.hot) {
    module.hot.accept('./app.js', function () {
        document.body.removeChild(app);
        app = require("./app").default();
        App(app);
        mount();

        console.log('module.hot.accept');
    });
}