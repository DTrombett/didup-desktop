import { env } from "node:process";

export default async () => {
	const installer: Record<string, string> & {
		default: (extensions: string[], forceDownload: boolean) => Promise<void>;
	} = require("electron-devtools-installer");

	return installer
		.default(
			["REACT_DEVELOPER_TOOLS"].map((name) => installer[name]),
			!!env.UPGRADE_EXTENSIONS!
		)
		.catch(console.log);
};
