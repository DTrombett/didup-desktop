import type { BrowserWindow } from "electron";
import type { Client } from "portaleargo-api";
import resolveHtmlPath from "./resolveHtmlPath";

export default async (client: Client, win: BrowserWindow) => {
	await client.loadData();
	if (!client.token) return win.loadURL(resolveHtmlPath("login"));
	await client.login();
	return win.loadURL(resolveHtmlPath("dashboard"));
};
