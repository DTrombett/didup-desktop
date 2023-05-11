import { useContext, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Context from "renderer/Context";
import Loading from "renderer/components/Loading";

export default () => {
	const context = useContext(Context);

	if (context.dashboard === undefined) return <Navigate replace to="/login" />;
	if (context.dashboard === null) {
		useEffect(() => {
			context.loadDashboard().catch(window.electron.log);
		}, [context]);
		return <Loading />;
	}
	if (!context.profileData)
		useEffect(() => {
			context.loadProfileDetails().catch(window.electron.log);
		}, [context]);
	return (
		<div>
			<span>This is the Dashboard</span>
			<br />
			<Link to="/profiles">Go to Profiles</Link>
		</div>
	);
};
