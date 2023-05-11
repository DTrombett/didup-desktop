import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Context from "renderer/Context";
import Profile from "renderer/components/Profile";
import backArrow from "../../../assets/backArrow.svg";
import styles from "../styles/ProfileDetails.module.css";

export default () => {
	const context = useContext(Context);

	if (!context.profile || !context.loginData)
		return <Navigate replace to="/login" />;
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
					login={context.loginData}
					profile={context.profile}
					key={context.profile.id}
				/>
			</div>
		</div>
	);
};
