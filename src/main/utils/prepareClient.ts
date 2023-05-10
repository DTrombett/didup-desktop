import type { Client } from "portaleargo-api";

export default async (client: Client) => {
	await client.loadData();
	if (!client.token) return undefined;
	await client.login();
	return client.dashboard;
};
