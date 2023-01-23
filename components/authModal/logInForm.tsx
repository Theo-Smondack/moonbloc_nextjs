import styles from "./authForm.module.css";
import {useEffect} from "react";

const LogInForm = () => {
    useEffect(() => {
        setTimeout(() => {
            const form = document.querySelector('.authForm') as HTMLElement
            form.style.transform = 'scaleY(1)'
        })
    })
    return (
        <div className={'authForm'}>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Email</div>
                <input type={"email"} className={styles.inputClass} placeholder={'Enter your email...'}/>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Password</div>
                <input type={"password"} className={styles.inputClass} placeholder={'Enter your password...'}/>
            </div>
            <button type={"submit"} className={`${styles.authFormButton} bgBlueButton`}
                    onClick={() => alert('Submitted')}>Log In
            </button>
        </div>
    )
}

export default LogInForm