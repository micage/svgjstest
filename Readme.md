### What is it?
This is my test area for developing component-based apps.
Look inside [package.json](https://github.com/micage/svgjstest/blob/master/package.json) -> scripts to 
see what you can do. At the moment it's dealing mostly with tree structures,
tree-views, table-views and database abstraction.

The central idea behind it all is: Apps are managing trees of data.
I want to find a way to unify app development with this idea in mind.
Also I want to do it in a component-, interface-oriented way.
At the end you get a tree of components where each component is managing it's part of the apps' data tree.

Each component is also associated with a database table. Each instance of a component becomes a row and public properties of the component are the columns in this table.

### Installing
Go to a directory of your choice

Get the repository:
```
git clone https://github.com/micage/svgjstest.git

cd svgjstest
```
Install dependencies:
```
npm i
```

For all samples: you can run a production build by appending a '+'-sign.
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
