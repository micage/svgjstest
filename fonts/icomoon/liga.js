/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'folder': '&#xe92f;',
            'directory': '&#xe92f;',
            'folder-open': '&#xe930;',
            'directory2': '&#xe930;',
            'plus': '&#xea0a;',
            'add': '&#xea0a;',
            'minus': '&#xea0b;',
            'subtract': '&#xea0b;',
            'circle-up': '&#xea41;',
            'up3': '&#xea41;',
            'circle-right': '&#xea42;',
            'right5': '&#xea42;',
            'circle-down': '&#xea43;',
            'down3': '&#xea43;',
            'circle-left': '&#xea44;',
            'left5': '&#xea44;',
            'eye': '&#xe9ce;',
            'views': '&#xe9ce;',
            'eye-plus': '&#xe9cf;',
            'views2': '&#xe9cf;',
            'eye-minus': '&#xe9d0;',
            'views3': '&#xe9d0;',
            'eye-blocked': '&#xe9d1;',
            'views4': '&#xe9d1;',
            'file-text2': '&#xe926;',
            'file4': '&#xe926;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
