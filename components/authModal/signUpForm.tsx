import styles from './authForm.module.css'
import {ChangeEvent, useEffect, useState} from "react";
import {SignUpData} from "../../types/usersAuthentication";
import {handleStatus, isEmail, isEmptyFields} from "../../utils/toolFunctions";
import {useStatusContext} from "../../context/status";

const SignUpForm = () => {
    useEffect(() => {
        setTimeout(() => {
            const form = document.querySelector('.authForm') as HTMLElement
            form.style.transform = 'scaleY(1)'
        })
    })
    const {setStatus} = useStatusContext()

    const initialState: SignUpData = {
        data: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        candidatePassword: ""
    }
    const [signUpData, setSignUpData] = useState<SignUpData>(initialState)

    const signUpFetcher = async (url: RequestInfo | URL) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpData)
        })
        return res.json()
    }

    const handleSingUp = async () => {
        // Verification
        if (isEmptyFields([signUpData.data.email,signUpData.data.password,
            signUpData.data.firstName,signUpData.data.lastName, signUpData.candidatePassword])){
            await handleStatus(setStatus,false,"Please fill all required fields")
            return
        }
        if (!isEmail(signUpData.data.email)){
            await handleStatus(setStatus,false,"Please enter a valid email")
            return
        }
        if (signUpData.data.password !== signUpData.candidatePassword){
            await handleStatus(setStatus,false,"Passwords do not match")
            return
        }
        console.log(signUpData)
        const res = await signUpFetcher('/api/auth/register')
        console.log(res)
        if (!res.ok){
            await handleStatus(setStatus,false,res.error)
            return
        }
        await handleStatus(setStatus,true,"User successfully created")
    }

    return (
        <div className={'authForm'}>
            <div className={styles.authFormInlineInputGroup}>
                <div className={styles.inputGroup}>
                    <div className={styles.inputLabel}>First name</div>
                    <input type={"text"} className={styles.inputClass} placeholder={'Enter your first name...'}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpData({
                               data: {...signUpData.data, firstName: e.target.value},
                               candidatePassword: signUpData.candidatePassword
                           })}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <div className={styles.inputLabel}>Last name</div>
                    <input type={"text"} className={styles.inputClass} placeholder={'Enter your last name...'}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpData({
                               data: {...signUpData.data, lastName: e.target.value},
                               candidatePassword: signUpData.candidatePassword
                           })}
                    />
                </div>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Email</div>
                <input type={"email"} className={styles.inputClass} placeholder={'Enter your email...'}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
                           setSignUpData({
                               data: {...signUpData.data, email: e.target.value},
                               candidatePassword: signUpData.candidatePassword
                           })
                       }
                }/>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Password</div>
                <input type={"password"} className={styles.inputClass} placeholder={'Enter your password...'}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpData({
                           data: {...signUpData.data, password: e.target.value},
                           candidatePassword: signUpData.candidatePassword
                       })}/>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>Verify password</div>
                <input type={"password"} className={styles.inputClass} placeholder={'Re-enter your password...'}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpData({
                           data: {...signUpData.data},
                           candidatePassword: e.target.value
                       })}/>
            </div>
            <button type={"submit"} className={`${styles.authFormButton} bgBlueButton`}
                    onClick={handleSingUp}>Sign Up
            </button>
        </div>
    )
}
export default SignUpForm