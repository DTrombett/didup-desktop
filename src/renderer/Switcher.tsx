import type { Dashboard } from "portaleargo-api";
import Splash from "./pages/Splash";
import { Navigate } from "react-router-dom";

export default ({ dashboard }: { dashboard?: Dashboard | null }) => {
	if (dashboard === null) return <Splash />;
	if (dashboard === undefined) return <Navigate replace to="/login" />;
	return <Navigate replace to="/dashboard" />;
};
