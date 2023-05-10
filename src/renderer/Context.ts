/* eslint-disable @typescript-eslint/no-empty-function */
import type { Dashboard, Login, Profilo } from "portaleargo-api";
import { createContext } from "react";

const Context = createContext<{
	dashboard?: Dashboard | null;
	profileData?: { profile: Profilo; loginData: Login } | null;
	loadDashboard: () => Promise<void>;
	loadProfileDetails: () => Promise<void>;
}>({
	loadDashboard: async () => {},
	loadProfileDetails: async () => {},
});

export const { Provider } = Context;
export default Context;
