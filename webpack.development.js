const copyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

dotenv.config();

module.exports = {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html',
        }),
        new copyWebpackPlugin([
            {from: 'static/**', to: '.'},
        ]),
        new webpack.EnvironmentPlugin(['JUDGE_SERVER']),
        new bundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerPort: 8081,
        }),
        new webpack.HotModuleReplacementPlugin({
            multiStep: true,
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 8080,
        hot: true,
        host: '0.0.0.0',
        overlay: true,
    },
};
