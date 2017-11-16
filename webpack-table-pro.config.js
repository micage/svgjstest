// TreeTable with pug, step by step

const path = require('path');
const webpack = require('webpack');
const buildPath = path.resolve(__dirname, 'www');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

process.env.DEBUG = false;

module.exports = {
    entry: [
        './appTableView.js'
    ],
    context: path.join(__dirname, 'src'),
    output: {
        path: buildPath, // Path of output file
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js']
    },

    plugins: [
        new UglifyJsPlugin(),

        new HtmlWebpackPlugin({ title: 'TreeTable with pug, step by step' }),

        new webpack.DefinePlugin({
            // __DEBUG__: JSON.stringify(JSON.parse(process.env.DEBUG)),
            __DEBUG__: JSON.stringify(false)
        }),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                },
                exclude: /(node_modules|plugins|platforms|hooks|node_server)/
            },
            {
                test: /\.(less)$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]' } // BEM-Style
                    },
                    {
                        loader: "less-loader",
                        options: { relativeUrls: false }
                    },
                ],
                //exclude: "/\.(png|jpg|svg)?$/"
            },
            {
                test: /\.(css)$/,
                use: [
                    "style-loader", "css-loader"
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=www/fonts/[name].[ext]'
            }
        ]
    }
};
