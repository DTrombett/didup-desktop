import { useEffect, useRef, useState } from "react";
import Error from "renderer/components/Error";
import Loading from "renderer/components/Loading";
import icon from "../../../assets/vario/nuovo-logo.svg";
import styles from "../styles/Login.module.css";

const loadingText = [
	"Stiamo aprendo la pagina per il login...",
	"Prosegui il login nel browser...",
	"Caricamento in corso...",
];
export default () => {
	const [loading, setLoading] = useState<string>();
	const error = useRef<string>();
	const count = useRef(0);

	useEffect(
		() => () => {
			window.app.removeAllListeners("login");
		},
		[]
	);
	return (
		<>
			{error.current != null && <Error error={error.current} />}
			{loading != null && <Loading text={loading} />}
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
					disabled={loading != null}
					onClick={() => {
						count.current = 1;
						setLoading(loadingText[0]);
						window.app.removeAllListeners("login");
						window.app.on("login", (err) => {
							if (err !== undefined) {
								if (err instanceof Error) error.current = err.message;
								else if (typeof err === "string") error.current = err;
								else error.current = "Errore sconosciuto";
								setLoading(undefined);
								window.app.removeAllListeners("login");
								return;
							}
							count.current++;
							setLoading(loadingText[count.current]);
						});
						window.app.send("login");
					}}
				>
					+
				</button>
			</div>
		</>
	);
};
