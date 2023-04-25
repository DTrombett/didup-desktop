import "bulma/css/bulma.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProfileDetails from "./pages/ProfileDetails";
import Splash from "./pages/Splash";
import "./styles/index.css";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route index Component={Splash} />
				<Route path="/login" Component={Login} />
				<Route path="/dashboard" Component={Dashboard} />
				<Route path="/profiledetails" Component={ProfileDetails} />
			</Routes>
		</Router>
	);
}
