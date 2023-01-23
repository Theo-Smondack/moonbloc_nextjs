import styles from './authButtons.module.css'
import {useAuthModalContext} from "../../context/authModal";
import {showAuthModal} from "../../utils/toolFunctions";

export enum ModalType {
    Login = "login",
    Signup = "signup"
}

const AuthButtons = () => {
    const {setModalState} = useAuthModalContext()
    return (
        <div style={{marginRight: "0 !important"}}>
            <div className={styles.authButtonContainer}>
                <button className={`${styles.authButton} bdBlueButton`}
                        onClick={() => showAuthModal(setModalState, true, ModalType.Login)}>
                    Log In
                </button>
                <button className={`${styles.authButton} bgBlueButton`}
                        onClick={() => showAuthModal(setModalState, true, ModalType.Signup)}>
                    Sign Up
                </button>
            </div>
        </div>

    )
}

export default AuthButtons