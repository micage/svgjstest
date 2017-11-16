document.addEventListener("onload", inlineSVG(), false)
function inlineSVG() {
    var SVGFile = "my.svg"
    var loadXML = new XMLHttpRequest;
    function handler() {
        if (loadXML.readyState == 4 && loadXML.status == 200)
            svgInlineDiv.innerHTML = loadXML.responseText
    }
    if (loadXML != null) {
        loadXML.open("GET", SVGFile, true);
        loadXML.onreadystatechange = handler;
        loadXML.send();
    }
}