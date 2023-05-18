import { Outlet, ScrollRestoration } from "react-router-dom";

export default () => (
	<>
		<Outlet />
		<ScrollRestoration />
	</>
);
