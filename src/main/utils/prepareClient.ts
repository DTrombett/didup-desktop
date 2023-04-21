import type { Client } from "portaleargo-api";
import resolveHtmlPath from "./resolveHtmlPath";

export default async (client: Client) => {
	await client.loadData();
	if (!client.token) return resolveHtmlPath("login");
	await client.login();
	return resolveHtmlPath("dashboard");
};
