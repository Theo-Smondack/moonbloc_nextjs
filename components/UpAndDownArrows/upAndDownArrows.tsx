import styles from './upAndDownArrows.module.css'
const UpAndDownArrows = () => {
    return (
        <div className={styles.container}>
                <i className={`${styles.icon} ${styles.arrow} ${styles.up}`}></i>
                <i className={`${styles.icon} ${styles.arrow} ${styles.down}`}></i>
        </div>

    )

}
export default UpAndDownArrows