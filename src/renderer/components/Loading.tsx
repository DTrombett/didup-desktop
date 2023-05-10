import icon from "../../../assets/loading.gif";
import styles from "../styles/Loading.module.css";

export default () => (
	<div className={styles.background}>
		<div className={styles.loading}>
			<img src={icon} alt="loading" width="30" className={styles.img} />
			Attendere...
		</div>
	</div>
);
