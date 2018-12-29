const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); 

module.exports = {
    entry: {
        admin: path.resolve(__dirname, '../src/admin/index.tsx'),
        blog: path.resolve(__dirname, '../src/blog/index.tsx'),
    },
    module: {
        rules: [{   // 转换ts文件
            test: /\.tsx?$/,
            use: 'babel-loader'
        }, {
            test: /\.less$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
                }
            }]
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
            use: ["style-loader", "css-loader", "postcss-loader"]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({ // blog
            filename: "index.html",
            template: 'index.html',
            inject: true,
            chunks: ['vendor', 'blog']
        }),
        new HtmlWebpackPlugin({ // admin
            filename: "admin.html",
            template: 'index.html',
            inject: true,
            chunks: ['vendor', 'admin']
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
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendor',
                }
            }
        }
    },
}