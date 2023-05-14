// Check if the renderer and main bundles are built
import chalk from "chalk";
import { existsSync } from "node:fs";
import { join } from "node:path";
import webpackPaths from "../configs/webpack.paths";

const mainPath = join(webpackPaths.distMainPath, "main.js");
const rendererPath = join(webpackPaths.distRendererPath, "renderer.js");

if (!existsSync(mainPath))
	throw new Error(
		chalk.whiteBright.bgRed.bold(
			'The main process is not built yet. Build it by running "npm run build:main"'
		)
	);

if (!existsSync(rendererPath))
	throw new Error(
		chalk.whiteBright.bgRed.bold(
			'The renderer process is not built yet. Build it by running "npm run build:renderer"'
		)
	);
