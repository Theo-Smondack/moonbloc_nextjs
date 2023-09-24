import styles from './walletModal.module.css'
import { WalletModalProps } from '../../types/props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { WalletInput } from '../../models/Wallet';
import { handleStatus } from '../../helpers/toolFunctions';
import { useStatusContext } from '../../context/status';
import { useWalletsContext } from '../../context/wallets';

const WalletModal = ({ showCallback,type,walletID }:WalletModalProps) => {
    const { data } = useSession()
    const { setStatus } = useStatusContext()
    const { wallets,setWallets } = useWalletsContext()
    interface WalletModalInput extends WalletInput{
        userEmail: string
        walletID: string
    }

    type WalletModalCreateInput = Omit<WalletModalInput,'walletID'>

    let _walletTitle: string = ''
    if (walletID) {
        const wallet = wallets.find(wallet => wallet._id as unknown as string === walletID)
        _walletTitle = wallet ? wallet.walletTitle : ''
    }

    const [walletData, setWalletData] = useState<WalletModalInput | WalletModalCreateInput>({
        walletTitle: _walletTitle,
        userEmail: data?.user ? data?.user.email as string : '',
        walletID: walletID ? walletID : undefined,
    })

    const postToApi = async (url: RequestInfo | URL) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(walletData),
        })
        return res.json()
    }

    const url = type === 'create' ? '/api/user/wallet/create' : '/api/user/wallet/update'

    const handleSubmit = async () => {
        if (walletData.walletTitle === '') {
            await handleStatus(setStatus, false, 'Please fill all required fields')
            return
        }
        const res = await postToApi(url)
        if (!res.ok) {
            await handleStatus(setStatus, false, res.error)
            return
        }
        if (type === 'create') {
            setWallets([...wallets,res.wallet])
        }else if (type === 'edit') {
            const _wallet = wallets.find(wallet => wallet._id as unknown as string === walletID)
            if (!_wallet) return
            _wallet.walletTitle = walletData.walletTitle
            setWallets([...wallets])
        }
        await handleStatus(setStatus, true, res.message)
        showCallback(false,type)
    }
    return (
        <div className={styles.modalFog}>
            <div className={styles.modal}>
                <div className={styles.closeIconContainer}>
                    <FontAwesomeIcon icon={faXmark} onClick={() => showCallback(false,type)}/>
                </div>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        <h2>{type==='create'?'Create a new':'Edit'} wallet</h2>
                    </div>
                    <div className={styles.modalForm}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Wallet name</div>
                            <input type={'text'} className={styles.inputClass} placeholder={'Enter a wallet name...'}
                                   value={walletData.walletTitle}
                                   onChange={(e) => setWalletData({ ...walletData, walletTitle: e.target.value })}/>
                        </div>
                        <button type={'submit'} className={`${styles.formButton} bgBlueButton`} onClick={handleSubmit}>
                            {type === 'create' ? 'Create' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletModal