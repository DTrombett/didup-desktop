import type { Profilo } from "portaleargo-api";
import { useState } from "react";
import Loading from "renderer/components/Loading";
import icon from "../../../assets/icon.svg";
import styles from "../styles/Login.module.css";

export default function Login() {
	const [profiles, setProfiles] = useState<Profilo[] | null>(null);
	const [loading, setLoading] = useState(true);

	if (!profiles)
		window.electron.ipcRenderer
			.invoke("getProfiles")
			.then((p) => {
				setProfiles(p);
				setLoading(false);
			})
			.catch(console.error);
	if (!profiles) return <Loading />;
	// TODO
	if (profiles.length) return <div>Sus</div>;
	return (
		<>
			{loading && <Loading />}
			<div className="Login">
				<div className={styles.curve} />
				<img alt="icon" src={icon} className={styles.icon} />
				<span className={styles.intro}>
					Ciao!
					<br />
					Questa è la nuova app argo per genitori e alunni/e
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
