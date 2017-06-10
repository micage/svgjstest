// @ts-nocheck

import { Div, genClassId } from "./Elements";
import * as Evt from "./Events";
import * as __ from "../Util/ParamCheck";

/**
 * Insert a slider "bar" between to child elements
 * @param {HTMLElement} elem 
 * @param {*} options 
 */

let cursorBackup = document.body.style.cursor;

const clsSplitted = genClassId();

// redirect window resize events to splitted elements
window.addEventListener("resize", function (evt) {
    let splittedElements = document.getElementsByClassName(clsSplitted);
    for (var i = 0; i < splittedElements.length; i++) {
        var element = splittedElements[i];
        Evt.trigger(element, "mgResize");
    }
});

export const split = function(box, options ) {
    box.classList.add(clsSplitted);

    let divs = box.children;
    if (divs.length !== 2) { // check, if there are exactly 2 divs
        console.error('Split.js: there has to be 2 child elements -> no split');
        return;
    }

    // default settings
    var settings = {
        horizontal: true, // otherwise layout is vertical
        ratio: 0.5
    };
    Object.assign(settings, options);
    if (!__.checkBoolean(settings.horizontal)) settings.horizontal = true; 
    if (!__.checkNumber(settings.ratio)) settings.ratio = 0.5;
    
    // insert bar in between one and two
    let one = divs.item(0);
    let bar = Div({ class: "bar" });
    let two = box.removeChild(divs.item(1));
    box.appendChild(bar);
    box.appendChild(two);
    one.classList.add('one');
    two.classList.add('two');
    divs = box.children; // necessary?

    let boxWidth = box.clientWidth;
    let boxHeight = box.clientHeight;

    for (let i = 0; i < divs.length; i++) {
        let childStyle = divs.item(i).style;
        if (settings.horizontal) {
            childStyle.display = "inline-block";
            childStyle.height = boxHeight + "px";
        }
        else {
            childStyle.width = boxWidth + "px";
        }
    }

    const onresize = function () {
        let ratio = settings.ratio;

        if (settings.horizontal) {
            let dx = box.clientWidth - bar.offsetWidth;
            let oneWidth = Math.floor(dx * ratio);
            one.style.width = oneWidth + "px";
            two.style.width = (dx - oneWidth) + "px";
        }
        else { // vertical
            let barHeight = bar.offsetHeight;
            one.style.height = (Math.floor((boxHeight - barHeight) * ratio)) + "px";
            two.style.height = (boxHeight - one.offsetHeight - barHeight) + "px";
        }
    };

    onresize(); // initial call

    box.addEventListener("mgRatioDo", function (ev) {
        settings.ratio = ev.detail !== undefined ? ev.detail : settings.ratio;
        if (settings.ratio < 0) settings.ratio = 0;
        if (settings.ratio > 1) settings.ratio = 1;
        onresize();
        return false; // consume event
    });
    box.addEventListener("mgChildReplaced", function (ev) {
        one = box.children.item(0);
        two = box.children.item(2);
        onresize();
    });

    let barX = 0, barY = 0;
    
    bar.addEventListener('mousedown', function(ev) {
        barX = ev.clientX - bar.offsetLeft;
        barY = ev.clientY - bar.offsetTop;
        document.body.style.cursor = bar.style.cursor;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        ev.preventDefault();
    });

    const onMouseMove = function(evt) {
        // self[0].dispatchEvent(new Event('ScrollStart', { "bubbles": true }));
        Evt.trigger(box, 'ScrollStart');

        let mouseX = evt.clientX;
        let mouseY = evt.clientY;

        if (settings.horizontal) {
            let oneWidth = mouseX - box.offsetLeft - barX;
            let barWidth = bar.offsetWidth;
            let twoWidth = boxWidth - oneWidth - barWidth;
            if (twoWidth < 0) {
                twoWidth = 0;
                oneWidth = boxWidth - barWidth;
            }
            if (oneWidth < 0) {
                oneWidth = 0;
                twoWidth = boxWidth - barWidth;
            }
            settings.ratio = oneWidth / (boxWidth - barWidth);
            one.style.width = oneWidth + "px";
            two.style.width = twoWidth + "px";
        }
        else { // vertical
            let oneHeight = mouseY - box.offsetTop - barY;
            let barHeight = barHeight;
            let twoHeight = boxHeight - oneHeight - barHeight;
            if (twoHeight < 0) {
                twoHeight = 0;
                oneHeight = boxHeight - barHeight;
            }
            if (oneHeight < 0) {
                oneHeight = 0;
                twoHeight = boxHeight - barHeight;
            }
            settings.ratio = oneHeight/(boxHeight - barHeight);
            one.style.height = oneHeight + "px";
            two.style.height = twoHeight + "px";
        }

        Evt.trigger(box, "mgRatio", settings.ratio);

        // cancel event
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };

    const onMouseUp = function(evt) {
        // self[0].dispatchEvent(new Event('mgScrollStop', { "bubbles":true }));
        Evt.trigger(box, 'mgScrollStop');
        
        document.body.style.cursor = cursorBackup;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

};

