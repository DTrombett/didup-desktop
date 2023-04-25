import type { Login, Profilo } from "portaleargo-api";
import user from "../../../assets/avatar/pupo.svg";
import active from "../../../assets/profile/icon-utente-in-uso.svg";
import options from "../../../assets/profile/opzioni.svg";
import styles from "../styles/Profile.module.css";

export default function Profile({
	profile,
	login,
	state = false,
}: {
	profile: Profilo;
	login: Login;
	state?: boolean;
}) {
	return (
		<div className={styles.profile}>
			<div className={styles.profileHeader}>
				<div className={styles.profileDetails}>
					<img src={user} alt="profile" className={styles.profileIcon} />
					<div>
						<div className={styles.studentName}>
							{profile.alunno.cognome} {profile.alunno.nome}
						</div>
						<div className={styles.className}>
							{profile.classe.classe}
							{profile.classe.sezione}
						</div>
						<div className={styles.year}>
							{new Date(profile.anno.dataInizio).getFullYear()}/
							{new Date(profile.anno.dataFine).getFullYear()}
						</div>
					</div>
				</div>
				{state && (
					<button
						className={`${styles.options} button`}
						type="button"
						onClick={() => {
							window.location.pathname = "profiledetails";
						}}
					>
						<img src={options} alt="options" className={styles.optionsImage} />
					</button>
				)}
			</div>
			<div className={styles.schoolName}>
				{profile.corso.descrizione} - {profile.plesso.descrizione}
			</div>
			{state && (
				<div className={styles.profileState}>
					<div className={styles.state}>
						<img src={active} alt="active" className={styles.stateImage} />
						<div>In uso</div>
					</div>
					<button
						className={`${styles.join} button`}
						onClick={() => {
							window.location.pathname = "dashboard";
						}}
						type="button"
					>
						Entra nel profilo
					</button>
				</div>
			)}
			<div className={styles.details}>
				Cod. Scuola: {login.schoolCode}
				<br />
				Utente: {login.username}
				<br />
				Account genitore intestato a {profile.genitore.nomeCompleto}
			</div>
		</div>
	);
}
