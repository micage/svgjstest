#!/usr/bin/env node
'use strict';
const apps = require('./apps.json');

const { log }  = require('util');
const fs = require('mz/fs');
const path = require('path');
const commandLineArgs = require('command-line-args')
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', type: String, multiple: false, defaultOption: true },
    { name: 'port', type: Number, multiple: false },
];

// process.traceDeprecation = true;

var [,, ...args] = process.argv;
// log(`args: ${args}`);

let _args = commandLineArgs(optionDefinitions)
// log("options:", _args);

let bDevelop;
let lastIndex = args[0].length - 1;
if (!lastIndex) {
    log("no args provided");
}
bDevelop = args[0][lastIndex] !== '+';
if (!bDevelop) args[0] = args[0].slice(0, args[0].length - 1);
bDevelop ? log("DEBUG") : log("RELEASE");

let app = apps[args[0]];
if (!app) {
    log("entry not found:", args);
    process.exit();
}

// let context = path.join(__dirname, 'src/apps/', app.dir);
// let entry = [ `./${app.name}.js` ];
let context = __dirname;
let entry = [ `./src/apps/${app.dir}/${app.name}.js` ];
console.log("-> dirname: " + __dirname);
console.log("-> entry: " + entry);

const config = require('./webpack.config.js');
if (bDevelop) {
    process.env.DEBUG = true;

    Object.assign(config, {
        mode: 'development',
        devtool: "inline-source-map",
        entry, 
        context,
        plugins:[
            new HtmlWebpackPlugin({ title: app.dir + " development"}),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin({ __DEBUG__: JSON.stringify(true) }),
        ]
    });

    const options = {
        //contentBase: 'www', // Relative directory for base of server
        host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
        hot: true, // Live-reload
        hotOnly: true,
        inline: true,
        noInfo: true,
        port: _args.port || 3020,
        stats: {
            colors: true
        }
    };

    webpackDevServer.addDevServerEntrypoints(config, options);
    const compiler = webpack(config);
    const server = new webpackDevServer(compiler, options);

    server.listen(options.port, 'localhost', () => {
        console.log('-> dev server listening on port ' + options.port);
    });
}
else {
    process.env.DEBUG = false;

    Object.assign(config, {
        mode: 'production',
        entry,
        context,
        output: {
            path: path.resolve("build/", app.dir),
            filename: 'bundle.js',
        },
        plugins: [
            new HtmlWebpackPlugin({ title: app.dir }),
            new webpack.DefinePlugin({ __DEBUG__: JSON.stringify(false) }),
            new UglifyJsPlugin(),
        ]
    });
    const compiler = webpack(config);
    compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
            log(err, stats);
        }
        log("done");
    });
}

