/* eslint-disable @typescript-eslint/no-empty-function */
import type { Dashboard, Login, Profilo, Token } from "portaleargo-api";
import { createContext } from "react";

const Context = createContext<{
	dashboard?: Dashboard;
	profile?: Profilo;
	loginData?: Login;
	token?: Token;
	loadDashboard: () => void;
	loadProfile: () => void;
	loadLogin: () => void;
	loadToken: () => void;
}>({
	loadDashboard: async () => {},
	loadProfile: async () => {},
	loadLogin: async () => {},
	loadToken: async () => {},
});

export const { Provider } = Context;
export default Context;
