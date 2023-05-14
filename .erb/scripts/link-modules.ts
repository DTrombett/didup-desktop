import { existsSync, symlinkSync } from "node:fs";
import webpackPaths from "../configs/webpack.paths";

const { srcNodeModulesPath } = webpackPaths;
const { appNodeModulesPath } = webpackPaths;

if (!existsSync(srcNodeModulesPath) && existsSync(appNodeModulesPath))
	symlinkSync(appNodeModulesPath, srcNodeModulesPath, "junction");
