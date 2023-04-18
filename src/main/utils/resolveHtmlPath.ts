import { resolve } from "node:path";
import { env } from "node:process";
import { URL } from "node:url";

export default (htmlFileName: string) => {
	if (env.NODE_ENV === "development") {
		const url = new URL(`http://localhost:${env.PORT ?? 1212}`);

		url.href += htmlFileName;
		return url.href;
	}
	return `file://${resolve(__dirname, "../renderer/", htmlFileName)}`;
};
