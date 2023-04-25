import backArrow from "../../../assets/backArrow.svg";
import styles from "../styles/ProfileDetails.module.css";

export default function ProfileDetails() {
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
			</div>
		</div>
	);
}
