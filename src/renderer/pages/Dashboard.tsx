import { useContext } from "react";
import { Link } from "react-router-dom";
import Context from "renderer/Context";

export default () => {
	const context = useContext(Context);

	return (
		<div>
			<span>
				Ultimo aggiornamento:{" "}
				{new Date(context.dashboard!.dataAggiornamento).toLocaleString()}
			</span>
			<br />
			<Link to="/profiles">Go to Profiles</Link>
		</div>
	);
};
