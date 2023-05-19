import type { Dashboard, Jsonify } from "portaleargo-api";
import { Link } from "react-router-dom";

export default ({ dashboard }: { dashboard: Jsonify<Dashboard> }) => (
	<div>
		<span>
			Ultimo aggiornamento:{" "}
			{new Date(dashboard.dataAggiornamento).toLocaleString()}
		</span>
		<br />
		<Link to="/profiles">Go to Profiles</Link>
	</div>
);
