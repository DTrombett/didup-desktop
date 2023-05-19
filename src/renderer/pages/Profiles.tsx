import type { Jsonify, Login, Profilo } from "portaleargo-api";
import Profile from "renderer/components/Profile";
import styles from "../styles/Profiles.module.css";

export default ({
	loginData,
	profile,
}: {
	loginData: Jsonify<Login>;
	profile: Jsonify<Profilo>;
}) => (
	<div className="Profiles">
		<span className={styles.header}>Scelta profilo</span>
		<div className={styles.grid}>
			<Profile loginData={loginData} profile={profile} state key={profile.id} />
		</div>
	</div>
);
