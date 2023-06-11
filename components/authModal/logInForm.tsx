import styles from "./authForm.module.css";
import {ChangeEvent, useEffect, useState} from "react";
import {LogInData} from "../../types/usersAuthentication";
import {handleStatus, isEmail, isEmptyFields, showAuthModal} from "../../helpers/toolFunctions";
import {useStatusContext} from "../../context/status";
import {signIn} from "next-auth/react";
import {useAuthModalContext} from "../../context/authModal";

const LogInForm = () => {
    useEffect(() => {
        setTimeout(() => {
            const form = document.querySelector('.authForm') as HTMLElement
            form.style.transform = 'scaleY(1)'
        })
    })
    const {setStatus} = useStatusContext()
    const {setModalState} = useAuthModalContext()
    const initialState: LogInData = {
        email: "",
        password: ""
    }
    const [logInData, setLogInData] = useState<LogInData>(initialState)

    const handleLogIn = async () => {
        // Verification
        if (isEmptyFields([logInData.email,logInData.password])){
            await handleStatus(setStatus,false,"Please fill all required fields")
            return
        }
        if (!isEmail(logInData.email)){
            await handleStatus(setStatus,false,"Please enter a valid email")
            return
        }
        const options = {redirect:false,email: logInData.email,password: logInData.password}
        const res = await signIn('credentials',options)
        if (res?.error){
            await handleStatus(setStatus,false,res.error)
            return
        }
        await handleStatus(setStatus,true,"User successfully connected")
        showAuthModal(setModalState, false, undefined)

    }

    return (
        <div className={'authForm'}>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Email</div>
                <input type={"email"} className={styles.inputClass} placeholder={'Enter your email...'}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setLogInData({
                           ...logInData,
                           email: e.target.value
                       })}/>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Password</div>
                <input type={"password"} className={styles.inputClass} placeholder={'Enter your password...'}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setLogInData({
                           ...logInData,
                           password: e.target.value
                       })}/>
            </div>
            <button type={"submit"} className={`${styles.authFormButton} bgBlueButton`}
                    onClick={handleLogIn}>Log In
            </button>
        </div>
    )
}

export default LogInForm