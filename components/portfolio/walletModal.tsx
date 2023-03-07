import styles from './walletModal.module.css'
import {createWalletModalProps} from "../../types/props";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {WalletInput} from "../../models/Wallet";
import {handleStatus} from "../../utils/toolFunctions";
import {useStatusContext} from "../../context/status";

const WalletModal = ({showCallback}:createWalletModalProps) => {
    const {data} = useSession()
    const {setStatus} = useStatusContext()
    interface WalletModalInput extends WalletInput{
        userEmail: string

    }
    const [walletData, setWalletData] = useState<WalletModalInput>({
        walletTitle: '',
        userEmail: data?.user ? data?.user.email as string : ''
    })

    const fetchApi = async (url: RequestInfo | URL) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(walletData)
        })
        return res.json()
    }

    const handleSubmit = async () => {
        if (walletData.walletTitle === '') {
            await handleStatus(setStatus, false, "Please fill all required fields")
            return
        }
        const res = await fetchApi('/api/user/wallet/create')
        if (!res.ok) {
            await handleStatus(setStatus, false, res.error)
            return
        }
        await handleStatus(setStatus, true, res.message)
        showCallback(false)
    }
    return (
        <div className={styles.modalFog}>
            <div className={styles.modal}>
                <div className={styles.closeIconContainer}
                     onClick={() => showCallback(false)}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        <h2>Create a new wallet</h2>
                    </div>
                    <div className={styles.modalForm}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Wallet name</div>
                            <input type={"text"} className={styles.inputClass} placeholder={'Enter a wallet name...'} onChange={
                                (e) => setWalletData({...walletData, walletTitle: e.target.value})
                            }/>
                        </div>
                        <button type={"submit"} className={`${styles.formButton} bgBlueButton`} onClick={handleSubmit}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletModal