import fs from "node:fs";
import path from "node:path";
import rimraf from "rimraf";
import webpackPaths from "../configs/webpack.paths";

export default () => {
	if (fs.existsSync(webpackPaths.distMainPath))
		rimraf.sync(path.join(webpackPaths.distMainPath, "*.js.map"));
	if (fs.existsSync(webpackPaths.distRendererPath))
		rimraf.sync(path.join(webpackPaths.distRendererPath, "*.js.map"));
}
