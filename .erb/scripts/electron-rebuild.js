import { execSync } from "node:child_process";
import { platform } from "node:process";
import { dependencies } from "../../release/app/package.json";
import webpackPaths from "../configs/webpack.paths";
import { existsSync } from "node:fs";

if (
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
	Object.keys(dependencies || {}).length > 0 &&
	existsSync(webpackPaths.appNodeModulesPath)
) {
	const electronRebuildCmd =
		"../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .";
	const cmd =
		platform === "win32"
			? electronRebuildCmd.replace(/\//g, "\\")
			: electronRebuildCmd;
	execSync(cmd, {
		cwd: webpackPaths.appPath,
		stdio: "inherit",
	});
}
