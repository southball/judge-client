const webpack = require('webpack');
const merge = require('webpack-merge');
const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = merge(require('./webpack.base.js'), {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new bundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerPort: 8081,
        }),
        new webpack.HotModuleReplacementPlugin({
            multiStep: true,
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        compress: true,
        port: 8080,
        hot: true,
        host: '0.0.0.0',
        overlay: true,
    },
});
