require('webpack');

var path = require('path');
var HTMLWebpackPlugin = require('html-webpack-plugin');
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
        ? []
        : [new HTMLWebpackPlugin()]
    ,

    devServer: {
        open: true,
        port: 3000
    },

    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map'
};
