/* eslint-disable @typescript-eslint/member-ordering */
import "bulma/css/bulma.min.css";
import type {
	Dashboard as DashboardData,
	Login as LoginData,
	Profilo,
	Token,
} from "portaleargo-api";
import { Component } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
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

export default class App extends Component {
	state: {
		dashboard?: DashboardData;
		profile?: Profilo;
		login?: LoginData;
		token?: Token;
	} = {
		profile: loadStorage<Profilo>("profile"),
		login: loadStorage<LoginData>("login"),
		token: loadStorage<Token>("token"),
	};

	async componentDidMount() {
		window.app.on("write", (name, value, nonce) => {
			localStorage.setItem(name, value);
			try {
				this.setState({
					[name]: JSON.parse(value),
				});
			} catch (err) {
				window.app.log(err);
			}
			window.app.send("write", nonce);
		});
		window.app.on("reset", (nonce) => {
			localStorage.clear();
			const state = { ...this.state };

			Object.keys(this.state).forEach((key) => {
				state[key as keyof typeof state] = undefined;
			});
			this.setState(state);
			window.app.send("reset", nonce);
		});
		if (this.state.login) {
			await window.app.invokeClientMethod("login", false).catch(window.app.log);
			this.setState({
				dashboard: loadStorage<DashboardData>("dashboard"),
			});
		}
	}

	shouldComponentUpdate(
		_nextProps: unknown,
		nextState: Readonly<App["state"]>
	) {
		return (
			nextState.dashboard !== this.state.dashboard ||
			nextState.login !== this.state.login ||
			nextState.profile !== this.state.profile ||
			nextState.token !== this.state.token
		);
	}

	componentWillUnmount() {
		window.app.removeAllListeners("write");
		window.app.removeAllListeners("reset");
	}

	setState<K extends keyof this["state"]>(
		state:
			| Pick<this["state"], K>
			| this["state"]
			| ((
					prevState: Readonly<this["state"]>,
					props: Readonly<this["state"]>
			  ) => Pick<this["state"], K> | this["state"] | null)
			| null,
		callback?: () => void
	) {
		super.setState(state, callback);
	}

	render() {
		return (
			<Provider
				value={{
					loginData: this.state.login,
					profile: this.state.profile,
					dashboard: this.state.dashboard,
					token: this.state.token,
					loadDashboard: () => {
						this.setState({
							dashboard: loadStorage<DashboardData>("dashboard"),
						});
					},
					loadProfile: () => {
						this.setState({
							profile: loadStorage<Profilo>("profile"),
						});
					},
					loadLoginData: () => {
						this.setState({
							login: loadStorage<LoginData>("login"),
						});
					},
					loadToken: () => {
						this.setState({
							token: loadStorage<Token>("token"),
						});
					},
				}}
			>
				<HashRouter>
					<Routes>
						<Route path="/" index Component={Splash} />
						<Route path="/login" Component={Login} />
						<Route path="/profiles" Component={Profiles} />
						<Route path="/dashboard" Component={Dashboard} />
						<Route path="/profileDetails" Component={ProfileDetails} />
						<Route path="*" element={<Navigate replace to="/" />} />
					</Routes>
				</HashRouter>
			</Provider>
		);
	}
}
