const Frame = require("./Frame");
const Vector3 = require("../Math/Vector3");
const parseSVG = require("../svg/SVGConvertor");
const testdata = require("../../assets/RPN.svg");

const SVGImage = function(args) {
    if (!args || !args.src) {
        console.warn("SVGImage has no data");
    }
    this.src = args.src;
    this.frame = new Frame();
    this.lines = [];
    this.pathes = [];
};

SVGImage.prototype = {
    init() {},
    update(t, dt) {},
    destroy() {},

    get frame() { return this.frame; },
    get lines() { return null; },
    get pathes() { return null; },
};

module.exports = SVGImage;