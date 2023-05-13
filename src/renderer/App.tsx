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

export default class App extends Component {
	static loadStorage<T>(key: string) {
		const item = localStorage.getItem(key);

		if (item == null) return undefined;
		try {
			return JSON.parse(item) as T;
		} catch (err) {
			return undefined;
		}
	}

	state: {
		dashboard?: DashboardData;
		profile?: Profilo;
		loginData?: LoginData;
		token?: Token;
	} = {
		profile: App.loadStorage<Profilo>("profile"),
		loginData: App.loadStorage<LoginData>("login"),
		token: App.loadStorage<Token>("token"),
	};

	// constructor(props: Record<string, never>) {
	// 	super(props);
	// }

	async componentDidMount() {
		if (this.state.loginData) {
			await window.electron
				.invokeClientMethod("login", false)
				.catch(window.electron.log);
			this.setState({
				dashboard: App.loadStorage<DashboardData>("dashboard"),
			});
		}
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
		callback?: (() => void) | undefined
	): void {
		super.setState(state, callback);
	}

	render() {
		return (
			<Provider
				value={{
					loginData: this.state.loginData,
					profile: this.state.profile,
					dashboard: this.state.dashboard,
					token: this.state.token,
					loadDashboard: () => {
						this.setState({
							dashboard: App.loadStorage<DashboardData>("dashboard"),
						});
					},
					loadProfile: () => {
						this.setState({
							profile: App.loadStorage<Profilo>("profile"),
						});
					},
					loadLoginData: () => {
						this.setState({
							loginData: App.loadStorage<LoginData>("login"),
						});
					},
					loadToken: () => {
						this.setState({
							token: App.loadStorage<Token>("token"),
						});
					},
				}}
			>
				<HashRouter>
					<Routes>
						<Route index path="/" Component={Splash} />
						<Route path="/login" Component={Login} />
						<Route path="/profiles" Component={Profiles} />
						<Route path="/dashboard" Component={Dashboard} />
						<Route path="/profiledetails" Component={ProfileDetails} />
						<Route path="*" element={<Navigate replace to="/" />} />
					</Routes>
				</HashRouter>
			</Provider>
		);
	}
}
