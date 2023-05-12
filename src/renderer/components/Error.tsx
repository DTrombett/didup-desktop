import styles from "../styles/Error.module.css";

export default ({ error }: { error: string }) => (
	<div className={styles.background}>
		<div className={styles.error}>Si è verificato un errore: {error}</div>
	</div>
);
