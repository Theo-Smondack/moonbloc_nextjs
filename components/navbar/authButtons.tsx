
import styles from './authButtons.module.css'

const AuthButtons = () => {
    return (
        <div className={styles.authButtonContainer}>
            <button className={`${styles.authButton} bdBlueButton`} onClick={() => console.log('isClicked')}>Log In</button>
            <button className={`${styles.authButton} bgBlueButton`} onClick={() => console.log('isClicked')}>Sign Up</button>
        </div>
    )
}

export default AuthButtons