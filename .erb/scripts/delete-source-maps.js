import { existsSync, readdirSync, unlinkSync } from "node:fs";
import webpackPaths from "../configs/webpack.paths";
import { join } from "node:path";

const rimraf = (folder) => {
	readdirSync(folder).forEach((file) => {
		if (file.endsWith(".js.map")) unlinkSync(join(folder, file));
	});
};

export default () => {
	if (existsSync(webpackPaths.distMainPath)) rimraf(webpackPaths.distMainPath);
	if (existsSync(webpackPaths.distRendererPath))
		rimraf(webpackPaths.distRendererPath);
};
