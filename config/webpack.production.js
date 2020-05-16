const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(require('./webpack.base'), {
    mode: 'production',
    devtool: 'inline-source-map',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
});
