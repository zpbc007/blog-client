const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); 
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        vendor: [
            'react',
            'react-dom',
            'codemirror',
            'react-codemirror2'
        ], // 第三方库
        app: './src/index.tsx' // 入口文件
    },
    module: {
        rules: [{   // 转换ts文件
            test: /\.tsx?$/,
            use: 'babel-loader'
        }, {
            test: /\.jsx?$/,
            use: 'source-map-loader',
            enforce: 'pre'
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "postcss-loader" // add css prefix
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, '../dist')], {
            verbose:  true,
            root: path.resolve(__dirname, '../')
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: 'index.html',
            inject: true
        })
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, '../tsconfig.json')
        })],
    },
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    }
}