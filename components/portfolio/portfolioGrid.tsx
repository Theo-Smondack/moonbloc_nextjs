import styles from './portfolioGrid.module.css'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import WalletModal from './walletModal';
import { useSession } from 'next-auth/react';
import Card from './card';
import { useWalletsContext } from '../../context/wallets';
import { WalletDocument } from '../../models/Wallet';
import { getDataFromApi } from '../../helpers/toolFunctions';
import { WalletModalProps } from '../../types/props';
import { useWalletModalContext } from '../../context/walletModal';


const PortfolioGrid = () => {
    const { data } = useSession()
    const { wallets } = useWalletsContext()
    const [walletList, setWalletList] = useState<WalletDocument[]>([])
    const { state, setState } = useWalletModalContext()

    useEffect(() => {
        if (data?.user?.email) {
            getDataFromApi(`/api/user/wallet/find?userEmail=${data?.user?.email}`).then(r => setWalletList(r.wallets))
        }
        return
    }, [wallets])

    const showModal = (show: boolean, type: WalletModalProps['type'], walletID?: string) => {
        show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        setState({ show, type, walletID });
    }

    return (
        <div className={styles.container}>
            {state.show ? <WalletModal showCallback={showModal} type={state.type} walletID={state.walletID}/> : null}
            <div className={styles.grid}>
                {walletList.length < 5 ?
                    (
                        <div className={styles.addCard} onClick={() => showModal(true, 'create')}>
                            <FontAwesomeIcon icon={faPlus} className={styles.addWalletIcon}/>
                        </div>) : null}
                {
                    walletList.map((portfolio, index) => {
                        const id = portfolio._id as unknown as string
                        return (

                                <Card id={id} title={portfolio.walletTitle} key={index} index={index}/>

                        )
                    })
                }
            </div>
        </div>
    )
}
export default PortfolioGrid