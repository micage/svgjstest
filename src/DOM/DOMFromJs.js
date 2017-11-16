// id, class and style will be directly copied
// for others appropriate functions (e.g. addEventListener for listeners)
// will be called

let component = {
    id: "id of component if wanted",
    type: "element type: div, span, ...",
    attr: { "attrName": value },
    listeners: { "eventName": handlerFunction },
    class: "",
    style: {},
    children: [
        component1, // e.g. { type: "SplitView", ... }
        component_2,
        ...
        component_n,
    ]
};

// if 'type' is not a common HTMLElement but a custom component like TreeView
// goal: "SplitView" -> SplitView()
// if we import SplitView, where is it? What's its parent container?
// should we better use require?

DOM[Type] = (args) => {
    args.Type = Type;
    let elem = Create(args)
    return elem;
}