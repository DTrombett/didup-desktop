import type { Jsonify, Login, Profilo } from "portaleargo-api";
import user from "../../../assets/avatar/pupo.svg";
import active from "../../../assets/profile/icon-utente-in-uso.svg";
import options from "../../../assets/profile/opzioni.svg";
import styles from "../styles/Profile.module.css";
import { Link } from "react-router-dom";

export default ({
	profile,
	loginData: login,
	state = false,
}: {
	profile: Jsonify<Profilo>;
	loginData: Jsonify<Login>;
	state?: boolean;
}) => (
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
				<Link className={`${styles.options} button`} to="/profileDetails">
					<img src={options} alt="options" className={styles.optionsImage} />
				</Link>
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
				<Link className={`${styles.join} button`} to="/dashboard">
					Entra nel profilo
				</Link>
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
