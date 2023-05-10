import { useContext, useEffect } from "react";
import styles from "../styles/Profiles.module.css";
import Context from "renderer/Context";
import Profile from "renderer/components/Profile";
import { Navigate } from "react-router-dom";
import Loading from "renderer/components/Loading";

export default () => {
	const context = useContext(Context);

	if (context.profileData === undefined)
		return <Navigate replace to="/login" />;
	if (context.profileData === null) {
		useEffect(() => {
			context.loadProfileDetails().catch(window.electron.log);
		}, [context]);
		return <Loading />;
	}
	return (
		<div className="Profiles">
			<span className={styles.header}>Scelta profilo</span>
			<div className={styles.grid}>
				<Profile
					login={context.profileData.loginData}
					profile={context.profileData.profile}
					state
					key={context.profileData.profile.id}
				/>
			</div>
		</div>
	);
};
