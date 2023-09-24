import styles from './authModal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalType } from '../navbar/authButtons';
import { useState } from 'react';
import LogInForm from './logInForm';
import SignUpForm from './signUpForm';
import { useAuthModalContext } from '../../context/authModal';
import { showAuthModal } from '../../helpers/toolFunctions';

const AuthModal = () => {
    const { modalState, setModalState } = useAuthModalContext()
    const [modalType, setModalType] = useState<ModalType | undefined>(modalState.type)

    const setModalHeight = () => {
        const root = document.querySelector(':root') as HTMLElement
        root.style.setProperty('--authmodal-height', `${modalType === ModalType.Login ? '338' : '510'}px`)
    }
    setModalHeight()

    return (
        <div className={styles.authModalFog}>
            <div className={styles.authModal}>
                <div className={styles.closeIconContainer}
                     onClick={() => showAuthModal(setModalState, false, undefined)}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
                <div className={styles.authModalContainer}>
                    <div className={styles.authModalHeader}>
                        <h2 className={modalType === ModalType.Login ? styles.titleActive : undefined} onClick={
                            () => {
                                // setModalHeight()
                                setModalType(ModalType.Login)

                            }
                        }>Log In</h2>
                        <h2 className={modalType === ModalType.Signup ? styles.titleActive : undefined} onClick={
                            () => {
                                // setModalHeight()
                                setModalType(ModalType.Signup)
                            }
                        }>Sign up</h2>
                    </div>
                    {
                        modalType === ModalType.Login ? <LogInForm/> : <SignUpForm/>
                    }
                </div>
            </div>
        </div>
    )
}
export default AuthModal