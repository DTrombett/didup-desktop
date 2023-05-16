import "bulma/css/bulma.min.css";
import type {
	Dashboard as DashboardData,
	Login as LoginData,
	Profilo,
	Token,
} from "portaleargo-api";
import { useEffect, useState } from "react";
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import { Provider } from "./Context";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfileDetails from "./pages/ProfileDetails";
import Profiles from "./pages/Profiles";
import Splash from "./pages/Splash";
import "./styles/index.css";

const loadStorage = <T,>(key: string) => {
	const item = localStorage.getItem(key);

	if (item == null) return undefined;
	try {
		return JSON.parse(item) as T;
	} catch (err) {
		return undefined;
	}
};

// TODO: Try using loaders
export default () => {
	const [dashboard, setDashboard] = useState<DashboardData>();
	const [profile, setProfile] = useState(() => loadStorage<Profilo>("profile"));
	const [loginData, setLogin] = useState(() => loadStorage<LoginData>("login"));
	const [token, setToken] = useState(() => loadStorage<Token>("token"));
	const router = createHashRouter([
		{
			path: "/",
			index: true,
			Component: Splash,
		},
		{
			path: "/login",
			Component: Login,
		},
		{
			path: "/profiles",
			Component: Profiles,
		},
		{
			path: "/dashboard",
			Component: Dashboard,
		},
		{
			path: "/profileDetails",
			Component: ProfileDetails,
		},
		{
			path: "*",
			element: <Navigate replace to="/" />,
		},
	]);

	useEffect(() => {
		const states = {
			dashboard: setDashboard,
			profile: setProfile,
			login: setLogin,
			token: setToken,
		};

		window.app.on("write", (name, value, nonce) => {
			localStorage.setItem(name, value);
			try {
				states[name as keyof typeof states](JSON.parse(value));
			} catch (err) {
				window.app.log(err);
			}
			window.app.send("write", nonce);
		});
		window.app.on("reset", (nonce) => {
			localStorage.clear();
			setDashboard(undefined);
			setProfile(undefined);
			setLogin(undefined);
			setToken(undefined);
			window.app.send("reset", nonce);
		});
		return () => {
			window.app.removeAllListeners("write");
			window.app.removeAllListeners("reset");
		};
	}, []);
	useEffect(() => {
		const prepare = async () => {
			if (loginData) {
				await window.app
					.invokeClientMethod("login", false)
					.catch(window.app.log);
				setDashboard(loadStorage<DashboardData>("dashboard"));
			}
		};

		void prepare();
	}, [loginData]);
	return (
		<Provider
			value={{
				loginData,
				profile,
				dashboard,
				token,
				loadDashboard: () => {
					setDashboard(loadStorage<DashboardData>("dashboard"));
				},
				loadProfile: () => {
					setProfile(loadStorage<Profilo>("profile"));
				},
				loadLogin: () => {
					setLogin(loadStorage<LoginData>("login"));
				},
				loadToken: () => {
					setToken(loadStorage<Token>("token"));
				},
			}}
		>
			<RouterProvider router={router} />
		</Provider>
	);
};
