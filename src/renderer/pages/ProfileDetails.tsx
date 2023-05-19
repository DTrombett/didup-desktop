import type { Jsonify, Login, Profilo } from "portaleargo-api";
import Profile from "renderer/components/Profile";
import backArrow from "../../../assets/backArrow.svg";
import styles from "../styles/ProfileDetails.module.css";

export default ({
	loginData,
	profile,
}: {
	loginData: Jsonify<Login>;
	profile: Jsonify<Profilo>;
}) => (
	<div className="ProfileDetails">
		<div className={styles.header}>
			<button
				type="button"
				className={`${styles.backIcon} button`}
				onClick={() => {
					window.history.back();
				}}
			>
				<img src={backArrow} alt="Go back" />
			</button>
			<div className={styles.title}>Dettaglio profilo</div>
			<Profile loginData={loginData} profile={profile} key={profile.id} />
		</div>
	</div>
);
