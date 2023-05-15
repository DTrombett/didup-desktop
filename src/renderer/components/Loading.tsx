import icon from "../../../assets/loading.gif";
import styles from "../styles/Loading.module.css";

export default ({ text = "Attendere..." }: { text?: string }) => (
	<div className={styles.background}>
		<div className={styles.loading}>
			<img src={icon} alt="loading" width="30" className={styles.img} />
			{text}
		</div>
	</div>
);
