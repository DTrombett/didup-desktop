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
}>({});

export const { Provider } = Context;
export default Context;
