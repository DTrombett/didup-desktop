import { app } from "electron";
import { resolve } from "node:path";
import { env } from "node:process";
import { URL } from "node:url";

export default (hash: string) => {
	if (app.isPackaged)
		return `file://${resolve(__dirname, "../renderer/index.html#/", hash)}`;
	const url = new URL(`http://localhost:${env.PORT ?? 1212}/index.html`);

	url.hash = `#/${hash}`;
	return url.href;
};
