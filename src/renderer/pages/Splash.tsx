import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Context from "renderer/Context";
import loading from "../../../assets/loading.gif";
import icon from "../../../assets/vario/nuovo-logo.svg";
import styles from "../styles/Splash.module.css";

export default () => {
	const context = useContext(Context);

	if (context.dashboard) return <Navigate replace to="/dashboard" />;
	if (!context.loginData) return <Navigate replace to="/login" />;
	return (
		<div className="Splash">
			<img alt="icon" className={styles.icon} src={icon} />
			<h1 className={`title ${styles.title}`}>La scuola a portata di click</h1>
			<span className={styles.version}>Versione 1.15.1</span>
			<img src={loading} alt="loading" className={styles.loading} />
		</div>
	);
};
