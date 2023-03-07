import styles from './portfolioGrid.module.css'
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faPlus} from "@fortawesome/free-solid-svg-icons";
import WalletModal from "./walletModal";
import {useSession} from "next-auth/react";
import {WalletDocument} from "../../models/Wallet";

const PortfolioGrid = () => {
    const {data} = useSession()
    const [portfolioList, setPortfolioList] = useState<WalletDocument[]>([]);
    const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

    const getUserWallets = async (url: RequestInfo | URL) => {
        const res = await fetch(url, {method: 'GET'})
        return res.json()
    }



    useEffect(() => {
        if (data?.user?.email) {
            getUserWallets(`/api/user/wallet/find?userEmail=${data?.user?.email}`).then(r => setPortfolioList(r.wallets))
        }
        return
    }, [data])

    const showModal = (show:boolean) => {
        show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        setShowWalletModal(show);
        if (!show) getUserWallets(`/api/user/wallet/find?userEmail=${data?.user?.email}`).then(r => setPortfolioList(r.wallets))
    }

    return (
        <div className={styles.container}>
            {showWalletModal ? <WalletModal showCallback={showModal}/> : null}
            <div className={styles.grid}>
                {portfolioList.length < 5 ?
                    (
                        <div className={styles.addCard} onClick={() => showModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className={styles.addWalletIcon}/>
                        </div>) : null}
                {
                    portfolioList.map((portfolio,index) => {
                        const id = portfolio._id as unknown as string
                        return (
                            <div className={styles.card} key={index}>
                                <div className={styles.ellipsisContainer} onClick={() => alert(id)}>
                                    <FontAwesomeIcon icon={faEllipsis} className={styles.ellipsis}/>
                                </div>
                                <div className={styles.cardTitleContainer}>
                                    <h2>{portfolio.walletTitle}</h2>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default PortfolioGrid