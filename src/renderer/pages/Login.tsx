import { useContext, useState } from "react";
import Loading from "renderer/components/Loading";
import icon from "../../../assets/vario/nuovo-logo.svg";
import styles from "../styles/Login.module.css";
import Error from "renderer/components/Error";
import Context from "renderer/Context";
import { Navigate } from "react-router-dom";

export default () => {
	const context = useContext(Context);

	if (context.dashboard) return <Navigate replace to="/dashboard" />;
	const [loading, setLoading] = useState(false);
	const error = new URLSearchParams(window.location.search).get("error") ?? "";

	return (
		<>
			{error && <Error error={error} />}
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
						window.electron.send("login");
					}}
				>
					+
				</button>
			</div>
		</>
	);
};
