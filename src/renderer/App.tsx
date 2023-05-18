import "bulma/css/bulma.min.css";
import type {
	Dashboard as DashboardData,
	Jsonify,
	Login as LoginData,
	Profilo,
	Token,
} from "portaleargo-api";
import { useEffect, useState } from "react";
import { RouterProvider, createHashRouter, redirect } from "react-router-dom";
import { Provider } from "./Context";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfileDetails from "./pages/ProfileDetails";
import Profiles from "./pages/Profiles";
import Root from "./pages/Root";
import Splash from "./pages/Splash";
import "./styles/index.css";

const loadStorage = <T,>(key: string) => {
	const item = localStorage.getItem(key);

	if (item == null) return undefined;
	try {
		return JSON.parse(item) as Jsonify<T>;
	} catch (err) {
		return undefined;
	}
};

export default () => {
	const [dashboard, setDashboard] = useState(() =>
		loadStorage<DashboardData>("dashboard")
	);
	const [profile, setProfile] = useState(() => loadStorage<Profilo>("profile"));
	const [loginData, setLogin] = useState(() => loadStorage<LoginData>("login"));
	const [token, setToken] = useState(() => loadStorage<Token>("token"));
	const router = createHashRouter([
		{
			Component: Root,
			children: [
				{
					index: true,
					Component: Splash,
					loader: () => {
						if (dashboard) return redirect("/dashboard");
						if (!token) return redirect("/login");
						return null;
					},
				},
				{
					path: "login",
					Component: Login,
					loader: () => {
						if (token) return redirect("/");
						return null;
					},
				},
				{
					path: "profiles",
					Component: Profiles,
					loader: () => {
						if (!(loginData && profile)) return redirect("/");
						return null;
					},
				},
				{
					path: "dashboard",
					Component: Dashboard,
					loader: () => {
						if (!dashboard) return redirect("/");
						return null;
					},
				},
				{
					path: "profileDetails",
					Component: ProfileDetails,
					loader: () => {
						if (!(loginData && profile)) return redirect("/");
						return null;
					},
				},
				{
					path: "*",
					loader: () => redirect("/"),
				},
			],
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
				console.log(err);
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
	if (loginData)
		useEffect(() => {
			void window.app.invokeClientMethod("login", false).catch(console.error);
		}, [loginData]);
	return (
		<Provider value={{ loginData, profile, dashboard, token }}>
			<RouterProvider router={router} />
		</Provider>
	);
};
