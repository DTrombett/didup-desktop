import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import Context from "renderer/Context";

export default () => {
	const context = useContext(Context);

	if (!context.dashboard) return <Navigate replace to="/login" />;
	return (
		<div>
			<span>This is the Dashboard</span>
			<br />
			<Link to="/profiles">Go to Profiles</Link>
		</div>
	);
};
