import "bulma/css/bulma.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./styles/index.css";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route index element={<Home />} />
			</Routes>
		</Router>
	);
}
