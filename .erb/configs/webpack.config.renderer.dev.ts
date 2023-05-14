import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import chalk from "chalk";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { env, exit } from "node:process";
import type { Configuration } from "webpack";
import {
	DllReferencePlugin,
	EnvironmentPlugin,
	LoaderOptionsPlugin,
	NoEmitOnErrorsPlugin,
} from "webpack";
import "webpack-dev-server";
import { merge } from "webpack-merge";
import checkNodeEnv from "../scripts/check-node-env";
import baseConfig from "./webpack.config.base";
import webpackPaths from "./webpack.paths";

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (env.NODE_ENV === "production") checkNodeEnv("development");

const port = env.PORT ?? 1212;
const manifest = resolve(webpackPaths.dllPath, "renderer.json");
const skipDLLs =
	__filename.includes("webpack.config.renderer.dev.dll") ||
	__filename.includes("webpack.config.eslint");

/**
 * Warn if the DLL is not built
 */
if (!skipDLLs && !(existsSync(webpackPaths.dllPath) && existsSync(manifest))) {
	console.log(
		chalk.black.bgYellow.bold(
			'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
		)
	);
	execSync("npm run postinstall");
}

const configuration: Configuration = {
	devtool: "inline-source-map",

	mode: "development",

	target: ["web", "electron-renderer"],

	entry: [
		`webpack-dev-server/client?http://localhost:${port}/dist`,
		"webpack/hot/only-dev-server",
		join(webpackPaths.srcRendererPath, "index.tsx"),
	],

	output: {
		path: webpackPaths.distRendererPath,
		publicPath: "/",
		filename: "renderer.dev.js",
		library: {
			type: "umd",
		},
	},

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
					MiniCssExtractPlugin.loader,
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
	plugins: [
		...(skipDLLs
			? []
			: [
					new DllReferencePlugin({
						context: webpackPaths.dllPath,
						manifest: require(manifest),
						sourceType: "var",
					}),
			  ]),
		new MiniCssExtractPlugin(),
		new NoEmitOnErrorsPlugin(),

		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 *
		 * By default, use 'development' as NODE_ENV. This can be overriden with
		 * 'staging', for example, by changing the ENV variables in the npm scripts
		 */
		new EnvironmentPlugin({
			NODE_ENV: "development",
		}),

		new LoaderOptionsPlugin({
			debug: true,
		}),

		new ReactRefreshWebpackPlugin(),

		new HtmlWebpackPlugin({
			filename: join("index.html"),
			template: join(webpackPaths.srcRendererPath, "index.ejs"),
			minify: {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
			},
			isBrowser: false,
			env: env.NODE_ENV,
			isDevelopment: env.NODE_ENV !== "production",
			nodeModules: webpackPaths.appNodeModulesPath,
		}),
	],

	node: {
		__dirname: false,
		__filename: false,
	},

	devServer: {
		port,
		compress: true,
		hot: true,
		headers: { "Access-Control-Allow-Origin": "*" },
		static: {
			publicPath: "/",
		},
		historyApiFallback: {
			verbose: true,
		},
		setupMiddlewares(middlewares) {
			console.log("Starting preload.js builder...");
			const preloadProcess = spawn("npm", ["run", "start:preload"], {
				shell: true,
				stdio: "inherit",
			})
				.on("close", (code: number) => exit(code))
				.on("error", (spawnError) => {
					console.error(spawnError);
				});

			console.log("Starting Main Process...");
			let args = ["run", "start:main"];
			if (env.MAIN_ARGS!)
				args = args.concat(
					["--", ...env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]+/g)].flat()
				);

			spawn("npm", args, {
				shell: true,
				stdio: "inherit",
			})
				.on("close", (code: number) => {
					preloadProcess.kill();
					exit(code);
				})
				.on("error", (spawnError) => {
					console.error(spawnError);
				});
			return middlewares;
		},
	},
};

export default merge(baseConfig, configuration);
