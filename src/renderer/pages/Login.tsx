import type { Login as LoginData, Profilo } from "portaleargo-api";
import { useState } from "react";
import Loading from "renderer/components/Loading";
import Profile from "renderer/components/Profile";
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
				<span className={styles.header}>Scelta profilo</span>
				<div className={styles.grid}>
					<Profile login={login} profile={profile} state />
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
