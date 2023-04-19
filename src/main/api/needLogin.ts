import type { Client } from "portaleargo-api";

const needLogin = async (client: Client) => {
	await client.loadData();
	return !client.token;
};

export default needLogin;
