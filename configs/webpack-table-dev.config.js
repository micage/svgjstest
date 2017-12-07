// TreeTable with pug, step by step

const path = require('path');
const webpack = require('webpack');
const buildPath = path.resolve(__dirname, '');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.DEBUG = true;

module.exports = {
    entry: [
        './main.js'
    ],
    context: path.join(__dirname, '../src/apps/TableView'),
    devServer: {
        contentBase: 'www', // Relative directory for base of server
        host: 'localhost', // Change to '0.0.0.0' for external facing server
        hot: true, // Live-reload
        hotOnly: true,
        inline: true,
        // noInfo: true,
        port: 3016, // Port Number
        proxy: {
            '/api': {
                target: {
                    host: "micage.mmm",
                    protocol: 'http:',
                    port: 80
                },
                pathRewrite: { '^/api': '/mmm/svgjs_test/www/php' }
            },
            //ignorePath: true,
            changeOrigin: true,
        }
    },
    devtool: 'source-map',
    output: {
        path: buildPath, // Path of output file
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js']
    },

    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(),
        
        new HtmlWebpackPlugin({ title: 'TreeTable with pug, step by step' }),

        // Allows error warnings but does not stop compiling.
        // new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            // __DEBUG__: JSON.stringify(JSON.parse(process.env.DEBUG)),
            __DEBUG__: JSON.stringify(true)
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
