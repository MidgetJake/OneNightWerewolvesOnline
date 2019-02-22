const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'client/public');
const APP_DIR = path.resolve(__dirname, 'client/src');

const config = {
    entry: {
        index: path.join(APP_DIR, 'Entry/index.jsx'),
    },
    mode: 'development',
    output: {
        path: BUILD_DIR,
        filename: '[name]/js/bundle.js',
    },
    resolve: {
        modules: ['node_modules', APP_DIR],
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: APP_DIR,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/react', '@babel/env'],
                    plugins: ['@babel/plugin-proposal-class-properties'],
                },
            },
            {
                test: /\.css$/,
                use: ['css-loader'],
            },
            {
                test: /\.(bmp|gif|jpg|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: 'static/media/[name].[hash:8].[ext]',
                    publicPath: '/',
                },
            },
        ],
    },
    node: {
        fs: 'empty',
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['index'],
            filename: 'index/index.ejs',
            template: '!!html-loader!client/src/template.ejs',
        }),
    ],
};

module.exports = config;