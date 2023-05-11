import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Context from "renderer/Context";
import Profile from "renderer/components/Profile";
import styles from "../styles/Profiles.module.css";

export default () => {
	const context = useContext(Context);

	if (!context.loginData || !context.profile)
		return <Navigate replace to="/login" />;
	return (
		<div className="Profiles">
			<span className={styles.header}>Scelta profilo</span>
			<div className={styles.grid}>
				<Profile
					login={context.loginData}
					profile={context.profile}
					state
					key={context.profile.id}
				/>
			</div>
		</div>
	);
};
