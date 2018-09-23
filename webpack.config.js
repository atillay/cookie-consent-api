require('webpack');

var path = require('path');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var MinifyPlugin = require("babel-minify-webpack-plugin");
var isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: ( process.env.NODE_ENV ? process.env.NODE_ENV : 'development' ),

    entry: './src/index.js',

    output: {
        library: 'CookieConsentApi',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        filename: 'cookie-consent-api.js',
        publicPath: isProd ? './' : '/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?![js\-cookie])/,
                use: ['babel-loader']
            }
        ]
    },

    plugins: isProd
        ? [
            new MinifyPlugin({}, {comments: false})
        ]
        : [
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'index.html'),
                filename: 'index.html'
            })
        ]
    ,

    devServer: {
        open: true,
        port: 3000
    },

    devtool: isProd ? '' : 'cheap-module-eval-source-map'
};
