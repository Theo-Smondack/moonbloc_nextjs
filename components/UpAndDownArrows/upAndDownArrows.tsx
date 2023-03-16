import styles from './upAndDownArrows.module.css'

type UpAndDownArrowsProps = {
    onClick: () => void
}
const UpAndDownArrows = ({onClick}:UpAndDownArrowsProps) => {
    return (
        <div className={styles.container}>
            <div onClick={onClick} className={styles.iconContainer}>
                <i className={`${styles.icon} ${styles.arrow} ${styles.up}`}></i>
                <i className={`${styles.icon} ${styles.arrow} ${styles.down}`}></i>
            </div>

        </div>

    )

}
export default UpAndDownArrows