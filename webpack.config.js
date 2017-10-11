// var webpack = require('webpack')
var path = require('path')

var BUILD_DIR = path.resolve(__dirname + '/build')
var APP_DIR = path.resolve(__dirname + '/app')
var webpack = require('webpack')

var config = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: "bundle.js"
    },
    devtool: 'source-map',
    devServer: {
        inline: true,
        contentBase: BUILD_DIR,
        port: 3030
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: APP_DIR,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
   
    ]

};

module.exports = config
