import "bulma/css/bulma.min.css";
import type {
	Dashboard as DashboardData,
	Login as LoginData,
	Profilo,
} from "portaleargo-api";
import { Component } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "./Context";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfileDetails from "./pages/ProfileDetails";
import Splash from "./pages/Splash";
import "./styles/index.css";
import Profiles from "./pages/Profiles";

export default class App extends Component {
	override state: {
		dashboard?: DashboardData | null;
		profileData?: { profile: Profilo; loginData: LoginData } | null;
	} = {
		dashboard: null,
		profileData: null,
	};

	// constructor(props: Record<string, never>) {
	// 	super(props);
	// }

	override setState<K extends keyof this["state"]>(
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

	override render() {
		return (
			<Provider
				value={{
					profileData: this.state.profileData,
					dashboard: this.state.dashboard,
					loadDashboard: async () => {
						this.setState(await window.electron.getClient("dashboard"));
					},
					loadProfileDetails: async () => {
						this.setState({
							profileData: await window.electron
								.getClient("profile", "loginData")
								.then(
									(data) =>
										data.loginData &&
										data.profile &&
										(data as Required<typeof data>)
								),
						});
					},
				}}
			>
				<BrowserRouter>
					<Routes>
						<Route index Component={Splash} />
						<Route path="/login" Component={Login} />
						<Route path="/profiles" Component={Profiles} />
						<Route path="/dashboard" Component={Dashboard} />
						<Route path="/profiledetails" Component={ProfileDetails} />
						<Route path="*" element={<Navigate replace to="/" />} />
					</Routes>
				</BrowserRouter>
			</Provider>
		);
	}
}
