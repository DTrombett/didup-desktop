import installer, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { env } from "node:process";

export default async () =>
	installer([REACT_DEVELOPER_TOOLS], !!env.UPGRADE_EXTENSIONS!).catch(
		console.error
	);
