### What is it?
This is one of my test areas for developing component-based apps.
The project title is a little misleading, reason is it started as a test for
SVG-Components and a tool to visualize mathematical problems (2D, 3D, time).
Later I decided to want a scenegraph (tree -> tree-view) for it.

Look inside [package.json](https://github.com/micage/svgjstest/blob/master/package.json) -> scripts to 
see what you can do. At the moment it's dealing mostly with tree structures,
tree-views, table-views and database abstraction. Later this will become the backbone of all my apps.

The central idea behind it all is: Apps are managing trees of data.
Files are serialized data trees.
I want to find a way to unify app development with this idea in mind.
Also I want to do it in a component-, interface-oriented way.
At the end you get a tree of components where each component is managing it's part of the apps' data tree.

Each component is also associated with a database table. Each instance of a component becomes a row and public properties of the component are the columns in this table. Syncing data between the app and the database is a user decision.
E.g. via a save button. You can also load and save partially.

What is a component (module could be used interchangably)?
In Javascript it's sadly just a normal object. There is no barrier, no encapsulation. You can read, write, modify values or even change the structure of any object. This is total freedom. Sounds good, but leads to total mess in
a world of shared code bases. So one way to avoid this is to agree on conventions.
The other would be to use a different language (No joke). Nowadays everyone knows
that e.g. changing the prototype of shared objects or even JS built-in objects is a really bad idea. Although no one could hold you back from doing it.

You get a component by calling a factory function, e.g.:
```
let myTableView = TableView(args); // returns an HTMLDivElement here
```
So you call a function with an argument object that contains properties and callback functions.
The argument object is the interface for the component. After creation you are not allowed
to modify the structure of the returned object. You only should access public
properties and functions (that means documented).

In the case of HTMLElement this means, use the data-mechanism (beware of weird transformations between dashed  and camel-case property names) and write custom events to call user-defined functions. 

I'm very tempted to break my own guideline here, because HTMLElement is so hard to extend (native ES6 uses derived classes, but i think it's only available for the Chrome browser). If the world wide web consumes a lot of our planets' resources, how much is it the fault of the clumsy and archaic class design of the Document Object Model (DOM)? I hardly ever use 10% of the properties and functions - aside they read like a telephone book. DOM-Trees of thousands of nodes are not uncommon. Every tiny HTMLElement (div, p, span, ...) has this huge list of properties and functions, needed or not. Every website on the planet is using the DOM. Would be a good time to start something new. DOM++. Website developers should use a component- and interface-based API like DirectX, compile their code and publish it as archives. Why should a user agent (funny word, means browser) not be fed with archived and compiled binaries? Every OS is doing it this way.

Let's stop the waste now!

Back to our components. Most of this writing deals with DOM-Components. Reason is components are just modules. You export what you like to be public, the rest is private. Very good. What makes writing DOM-Components hard is the fact that the interfaces are fixed, you cannot derive a CustomHTMLElement (unless you are using ES6 and Chrome). The browser will not accept it.

Also the regular way to customize built-in elements is clumsy to say the least. So why would you do it?
1. connect HTMLElements with a controller class instance (that connects to a model class instance)
2. define custom interfaces (all you need interfaces)

Hard and clumsy but it can be done. Like this: 

...

To be continued ... this is just the beginning of the component story.

### Installing
Open the terminal app. Go to a directory of your choice.

Get the repository:
```
git clone https://github.com/micage/svgjstest.git

cd svgjstest
```
Install dependencies:
```
npm i
```

Now you are ready to run the samples. For all samples: you can run a production build by appending a '+'-sign.
For example ```npm run tree-ed+```

#### Tree Editor
Start devserver on port 3020, then visit localhost:3020 in the browser
```
npm run tree-ed
```

#### Tree Replication and filtering
Start devserver on port 3015, then visit localhost:3015 in the browser
```
npm run tree-rep
```

#### Table View
Start devserver on port 3016, then visit localhost:3016 in the browser
```
npm run tree-rep
```

#### Vector SVG Test - not working right now, reimplementing the scenegraph
Start devserver on port 3014, then visit localhost:3014 in the browser
```
npm run vector &&  open http://localhost:3014
```



### Caution and disclaimer
All work in progress and highly experimental
