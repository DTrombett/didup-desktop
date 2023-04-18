import "bulma/css/bulma.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginCallback from "./pages/LoginCallback";
import "./styles/index.css";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login-callback" element={<LoginCallback />} />
				<Route path="/index.html" element={<Home />} />
			</Routes>
		</Router>
	);
}
