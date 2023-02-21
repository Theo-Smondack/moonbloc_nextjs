import styles from './cryptoDetails.module.css'

const LoadingCryptoDetails = () => {
    return (
        <div className={styles.container}>
            <div className={styles.loadingHeadContainer}></div>
            <div className={styles.loadingChartContainer}></div>
            <div className={styles.loadingBottomContainer}>
                <div className={styles.loadingDescContainer}></div>
                <div className={styles.loadingLinksContainer}></div>
            </div>
        </div>
    )
}
export default LoadingCryptoDetails