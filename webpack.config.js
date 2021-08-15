var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "js/bundle.js",
        path: __dirname + "/.dist/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    devServer: {
        contentBase: './',
        hot: true,
        inline: true,
        historyApiFallback: true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                APP_VERSION: JSON.stringify(require("./package.json").version)
            }
        }),
        new CopyWebpackPlugin({patterns: [
            {from: "css", to: "css"},
            {from: "img", to: "img"},
            {from: "fonts", to: "fonts"},
            {from: "errors", to: "errors"},
            {from: "index.html"},
            {from: "manifest.json"},
            {from: ".htaccess"},
//            {from: "node_modules/noty/lib/noty.css", to: "css_ext"},
           {from: "node_modules/font-awesome/css/font-awesome.min.css", to: "css_ext"},
           {from: "node_modules/font-awesome/fonts", to: "fonts"}
        ]})
    ],

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            'noty': 'noty'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader"
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }

        ]
    }
};