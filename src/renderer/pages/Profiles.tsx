import { useContext } from "react";
import Context from "renderer/Context";
import Profile from "renderer/components/Profile";
import styles from "../styles/Profiles.module.css";

export default () => {
	const context = useContext(Context);
	const first =
		new URLSearchParams(window.location.search).get("first") != null;

	return (
		<div className="Profiles">
			<span className={styles.header}>Scelta profilo</span>
			<div className={styles.grid}>
				<Profile
					login={context.loginData!}
					profile={context.profile!}
					state
					key={context.profile!.id}
				/>
			</div>
			{first && (
				<div className={styles.first}>
					Accesso effettuato con successo! Ora puoi chiudere la finestra del
					browser
				</div>
			)}
		</div>
	);
};
