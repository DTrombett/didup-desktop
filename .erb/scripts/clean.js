import { rmSync } from "node:fs";
import webpackPaths from "../configs/webpack.paths";

const foldersToRemove = [
	webpackPaths.distPath,
	webpackPaths.buildPath,
	webpackPaths.dllPath,
];

foldersToRemove.forEach((folder) => {
	rmSync(folder, { recursive: true, force: true });
});
