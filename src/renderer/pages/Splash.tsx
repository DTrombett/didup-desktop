import loading from "../../../assets/loading.gif";
import icon from "../../../assets/vario/nuovo-logo.svg";
import styles from "../styles/Splash.module.css";

export default () => (
	<div className="Splash">
		<img alt="icon" className={styles.icon} src={icon} />
		<h1 className={`title ${styles.title}`}>La scuola a portata di click</h1>
		<span className={styles.version}>Versione 1.15.1</span>
		<img src={loading} alt="loading" className={styles.loading} />
	</div>
);
