/**
 * Builds the DLL for development electron renderer process
 */

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join } from "node:path";
import type { Configuration } from "webpack";
import { DllPlugin, EnvironmentPlugin, LoaderOptionsPlugin } from "webpack";
import { merge } from "webpack-merge";
import { dependencies } from "../../package.json";
import checkNodeEnv from "../scripts/check-node-env";
import baseConfig from "./webpack.config.base";
import webpackPaths from "./webpack.paths";

checkNodeEnv("development");

const dist = webpackPaths.dllPath;

const configuration: Configuration = {
	context: webpackPaths.rootPath,

	devtool: "eval",

	mode: "development",

	target: "electron-renderer",

	externals: ["fsevents", "crypto-browserify"],

	/**
	 * Use `module` from `webpack.config.renderer.dev.js`
	 */
	module: {
		rules: [
			{
				test: /\.s?(c|a)ss$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true,
							sourceMap: true,
							importLoaders: 1,
						},
					},
					"sass-loader",
				],
				include: /\.module\.s?(c|a)ss$/,
			},
			{
				test: /\.s?(c|a)ss$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader",
				],
				exclude: /\.module\.s?(c|a)ss$/,
			},
			// Fonts
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			// Images
			{
				test: /\.(png|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			// SVG
			{
				test: /\.svg$/,
				use: [
					{
						loader: "@svgr/webpack",
						options: {
							prettier: false,
							svgo: false,
							svgoConfig: {
								plugins: [{ removeViewBox: false }],
							},
							titleProp: true,
							ref: true,
						},
					},
					"file-loader",
				],
			},
		],
	},

	entry: {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
		renderer: Object.keys(dependencies || {}),
	},

	output: {
		path: dist,
		filename: "[name].dev.dll.js",
		library: {
			name: "renderer",
			type: "var",
		},
	},

	plugins: [
		new DllPlugin({
			path: join(dist, "[name].json"),
			name: "[name]",
		}),

		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 */
		new EnvironmentPlugin({
			NODE_ENV: "development",
		}),

		new LoaderOptionsPlugin({
			debug: true,
			options: {
				context: webpackPaths.srcPath,
				output: {
					path: webpackPaths.dllPath,
				},
			},
		}),
	],
};

export default merge(baseConfig, configuration);
