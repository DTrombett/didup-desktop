import Profile from "renderer/components/Profile";
import backArrow from "../../../assets/backArrow.svg";
import styles from "../styles/ProfileDetails.module.css";
import { useContext, useEffect } from "react";
import Context from "renderer/Context";
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
				<Profile
					login={context.profileData.loginData}
					profile={context.profileData.profile}
					key={context.profileData.profile.id}
				/>
			</div>
		</div>
	);
};
