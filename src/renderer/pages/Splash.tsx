import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Context from "renderer/Context";
import loading from "../../../assets/loading.gif";
import icon from "../../../assets/vario/nuovo-logo.svg";
import styles from "../styles/Splash.module.css";

export default () => {
	const context = useContext(Context);
	const navigate = useNavigate();

	useEffect(() => {
		if (context.dashboard) navigate("/dashboard", { replace: true });
		else if (!context.loginData) navigate("/login", { replace: true });
	});
	return (
		<div className="Splash">
			<img alt="icon" className={styles.icon} src={icon} />
			<h1 className={`title ${styles.title}`}>La scuola a portata di click</h1>
			<span className={styles.version}>Versione 1.15.1</span>
			<img src={loading} alt="loading" className={styles.loading} />
		</div>
	);
};
