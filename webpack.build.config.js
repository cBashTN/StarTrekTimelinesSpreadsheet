const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PACKAGE = require('./package.json');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR];

module.exports = {
	entry: SRC_DIR + '/index.js',
	output: {
		path: OUTPUT_DIR,
		publicPath: './',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				}),
				include: defaultInclude
			},
			{
				test: /\.jsx?$/,
				use: [{ loader: 'babel-loader' }],
				include: defaultInclude
			},
			{
				test: /\.ts$/,
				enforce: 'pre',
				loader: 'tslint-loader',
				options: {
					typeCheck: true,
					emitErrors: true
				},
				include: defaultInclude
			},
			{
				test: /\.tsx?$/,
				loader: ['babel-loader', 'ts-loader'],
				include: defaultInclude
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude
			}
		]
	},
	target: 'electron-renderer',
	plugins: [
		new HtmlWebpackPlugin({ title: 'Star Trek Timelines Crew Management v' + PACKAGE.version }),
		new ExtractTextPlugin('bundle.css'),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new MinifyPlugin()
	],
	stats: {
		colors: true,
		children: false,
		chunks: false,
		modules: false
	}
};
