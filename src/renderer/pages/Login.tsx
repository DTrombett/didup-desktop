import type { Login as LoginData, Profilo } from "portaleargo-api";
import { useState } from "react";
import Loading from "renderer/components/Loading";
import user from "../../../assets/avatar/pupo.svg";
import active from "../../../assets/profile/icon-utente-in-uso.svg";
import options from "../../../assets/profile/opzioni.svg";
import icon from "../../../assets/vario/nuovo-logo.svg";
import styles from "../styles/Login.module.css";

export default function Login() {
	const [details, setDetails] = useState<
		[Profilo, LoginData] | null | undefined
	>(null);
	const [loading, setLoading] = useState(true);

	if (details === null) {
		Promise.all([
			window.electron.ipcRenderer.getClient("profile"),
			window.electron.ipcRenderer.getClient("loginData"),
		])
			.then(([p, l]) => {
				setDetails(p && l && [p, l]);
				setLoading(false);
			})
			.catch(window.electron.ipcRenderer.log);
		return <Loading />;
	}
	if (details) {
		const [profile, login] = details;
		return (
			<div className={styles.chooseProfile}>
				<div className={styles.header}>Scelta profilo</div>
				<div className={styles.grid}>
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
							<button
								className={`${styles.options} button`}
								type="button"
								onClick={() => {
									window.location.pathname = "profiledetails";
								}}
							>
								<img
									src={options}
									alt="options"
									className={styles.optionsImage}
								/>
							</button>
						</div>
						<div className={styles.schoolName}>
							{profile.corso.descrizione} - {profile.plesso.descrizione}
						</div>
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
						<div className={styles.details}>
							Cod. Scuola: {login.schoolCode}
							<br />
							Utente: {login.username}
							<br />
							Account genitore intestato a {profile.genitore.nomeCompleto}
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<>
			{loading && <Loading />}
			<div className="Login">
				<div className={styles.curve} />
				<img alt="icon" src={icon} className={styles.icon} />
				<span className={styles.intro}>
					Ciao!
					<br />
					Questa è la nuova app argo per genitori e alunni
				</span>
				<span className={styles.intro}>
					Aggiungi i profili scuola che vuoi seguire
				</span>
				<span className={styles.footer}>
					Oppure rivolgiti alla tua scuola se non sei in possesso delle
					credenziali per accedere
				</span>
				<button
					className={`${styles.addProfile} button`}
					type="button"
					disabled={loading}
					onClick={() => {
						setLoading(true);
						window.electron.ipcRenderer.send("login");
					}}
				>
					+
				</button>
			</div>
		</>
	);
}
