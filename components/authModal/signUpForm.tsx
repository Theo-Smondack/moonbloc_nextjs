import styles from './authForm.module.css'
import {useEffect} from "react";

const SignUpForm = () => {
    useEffect(() => {
        setTimeout(() => {
            const form = document.querySelector('.authForm') as HTMLElement
            form.style.transform = 'scaleY(1)'
        })
    })
    return (
        <div className={'authForm'}>
            <div className={styles.authFormInlineInputGroup}>
                <div className={styles.inputGroup}>
                    <div className={styles.inputLabel}>First name</div>
                    <input type={"text"} className={styles.inputClass} placeholder={'Enter your first name...'}/>
                </div>
                <div className={styles.inputGroup}>
                    <div className={styles.inputLabel}>Last name</div>
                    <input type={"text"} className={styles.inputClass} placeholder={'Enter your last name...'}/>
                </div>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Email</div>
                <input type={"email"} className={styles.inputClass} placeholder={'Enter your email...'}/>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Password</div>
                <input type={"password"} className={styles.inputClass} placeholder={'Enter your password...'}/>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Verify password</div>
                <input type={"password"} className={styles.inputClass} placeholder={'Re-enter your password...'}/>
            </div>
            <button type={"submit"} className={`${styles.authFormButton} bgBlueButton`}
                    onClick={() => alert('Submitted')}>Sign Up
            </button>
        </div>
    )
}
export default SignUpForm