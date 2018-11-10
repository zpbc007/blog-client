const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        port: 9000,
        hot: true,
        host: '0.0.0.0',
        proxy: {
            "/api": {
                target: 'http://localhost:8080',
                pathRewrite: {"^/api" : ""},
            }
        },
        historyApiFallback: true, // 404页面返回index.html
        contentBase: '../dist',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({})
    ]
})