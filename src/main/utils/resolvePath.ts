import { app } from "electron";
import { resolve } from "node:path";
import { env } from "node:process";
import { URL } from "node:url";

export default ({
	hash = "/",
	search = "",
}: {
	hash?: string;
	search?: string;
} = {}) => {
	const url = new URL(
		app.isPackaged
			? `file://${resolve(__dirname, "../renderer/index.html")}`
			: `http://localhost:${env.PORT ?? 1212}/index.html`
	);

	url.search = search;
	url.hash = hash;
	return url.href;
};
