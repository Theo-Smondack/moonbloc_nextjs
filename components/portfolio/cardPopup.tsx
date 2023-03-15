import styles from './cardPopup.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {CardPopupProps} from "../../types/props";
import React, {useEffect, useRef, useState} from "react";
import {useWalletsContext} from "../../context/wallets";
import {useWalletModalContext} from "../../context/walletModal";


const CardPopup = ({id,hoverCallback}: CardPopupProps) => {
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const {wallets,setWallets} = useWalletsContext()
    const {setState} = useWalletModalContext()

    const handleDelete =  async() => {
        await fetch(`/api/user/wallet/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletID: id
            })
        }).then(res => {
            if (res.ok) {
                const newWallets = wallets.filter(wallet => wallet._id as unknown as string !== id)
                setWallets(newWallets)
            }
        })
    }

    const popupRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
    }, [])
    const handleClickOutside = (e: MouseEvent) => {
        if (popupRef.current) {
            if (!popupRef.current?.contains(e.target as Node)) {
                setShowPopup(false)
            }
        }
    }

    const handleEdit = () => {
        setState({show: true, type: 'edit', walletID: id})
        setTimeout(() => {
            setShowPopup(false)
        }, 10)
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setShowPopup(true)
    }


    return (
        <div className={styles.ellipsisContainer} onClick={(e) => handleClick(e)} onMouseEnter={() => hoverCallback(false)}
             onMouseLeave={() => hoverCallback(true)}>
            <FontAwesomeIcon icon={faEllipsis} className={styles.ellipsis}/>
            {showPopup ?
                <div className={styles.cardPopup} ref={popupRef}>
                    <div className={styles.cardPopupContainer}>
                        <div className={styles.cardPopupContainerItem} onClick={handleEdit}>
                            <FontAwesomeIcon icon={faPen} className={styles.itemIcon}/>
                            Edit
                        </div>
                        <div className={`${styles.cardPopupContainerItem} ${styles.deleteItem}`} onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrash} className={styles.itemIcon}/>
                            Delete
                        </div>
                    </div>
                </div> : null}
        </div>

    )
}
export default CardPopup