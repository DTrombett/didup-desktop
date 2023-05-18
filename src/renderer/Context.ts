/* eslint-disable @typescript-eslint/no-empty-function */
import type {
	Dashboard,
	Jsonify,
	Login,
	Profilo,
	Token,
} from "portaleargo-api";
import { createContext } from "react";

const Context = createContext<{
	dashboard?: Jsonify<Dashboard>;
	profile?: Jsonify<Profilo>;
	loginData?: Jsonify<Login>;
	token?: Jsonify<Token>;
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
