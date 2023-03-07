import styles from './portfolioGrid.module.css'
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faPlus} from "@fortawesome/free-solid-svg-icons";

const PortfolioGrid = () => {
    const [portfolioList, setPortfolioList] = useState<any[]>([]);
    useEffect(() => {
        setPortfolioList([
            {
                id: 1,
                name: 'Wallet'
            },
            {
                id: 2,
                name: 'Portfolio 2'
            },
            {
                id: 3,
                name: 'Portfolio 3'
            },
            {
                id: 4,
                name: 'Portfolio 4'
            },
        ])
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {portfolioList.length < 5 ?
                    (
                        <div className={styles.addCard} onClick={() => alert('Open creation modal')}>
                            <FontAwesomeIcon icon={faPlus} className={styles.addWalletIcon}/>
                        </div>) : null}
                {
                    portfolioList.map((portfolio) => {
                        return (
                            <div className={styles.card} key={portfolio.id}>
                                <div className={styles.ellipsisContainer} onClick={() => alert('Open update modal')}>
                                    <FontAwesomeIcon icon={faEllipsis} className={styles.ellipsis}/>
                                </div>
                                <div className={styles.cardTitleContainer}>
                                    <h2>{portfolio.name}</h2>
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