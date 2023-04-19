import "renderer/styles/loading.css";
import icon from "../../../assets/loading.gif";

export default function Loading() {
	return (
		<div className="background">
			<div className="loading">
				<img src={icon} alt="loading" width="30" />
				Attendere...
			</div>
		</div>
	);
}
