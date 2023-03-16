import {NoAssetWalletProps} from "../../../types/props";
import styles from './noAssetWallet.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import AssetSelectorModal from "./assetSelectorModal";

const NoAssetWallet = ({walletID,walletTitle}: NoAssetWalletProps) => {
    const [showModal, setShowModal] = useState<boolean>(false)

    const openModal = (show:boolean) => {
        setShowModal(show)
    }

    return (
        <div className={styles.container}>
            {showModal ? <AssetSelectorModal showCallback={openModal} walletTitle={walletTitle}/> : null}
            There is no asset yet on this wallet add the first one
            <button className={`bgBlueButton ${styles.addTransactionButton}`}
                    onClick={() => openModal(true)}>
                <FontAwesomeIcon icon={faCirclePlus} className={styles.icon}/>
                Add asset
            </button>
        </div>
    )

}
export default NoAssetWallet