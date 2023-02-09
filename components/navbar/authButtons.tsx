import styles from './authButtons.module.css'
import {useAuthModalContext} from "../../context/authModal";
import {showAuthModal} from "../../utils/toolFunctions";
import {AuthButtonsProps} from "../../types/props";

export enum ModalType {
    Login = "login",
    Signup = "signup"
}

const AuthButtons = ({setNavbar}:AuthButtonsProps) => {
    const {setModalState} = useAuthModalContext()
    const handleClick = (type:ModalType) => {
        showAuthModal(setModalState, true, type)
        if (setNavbar) {
            setNavbar(false)
        }
    }
    return (
        <div style={{marginRight: "0 !important"}}>
            <div className={styles.authButtonContainer}>
                <button className={`${styles.authButton} bdBlueButton`}
                        onClick={() => handleClick(ModalType.Login)}>
                    Log In
                </button>
                <button className={`${styles.authButton} bgBlueButton`}
                        onClick={() => handleClick(ModalType.Signup)}>
                    Sign Up
                </button>
            </div>
        </div>

    )
}

export default AuthButtons