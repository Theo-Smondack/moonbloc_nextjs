import {AssetSelectorProps} from "../../../types/props";
import styles from "./assetSelectorModal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Image from "next/image";
import {Cryptos} from "../../../utils/allCryptos";

export type searchValue = {
    symbol: string,
    name: string,
    id: string,
    image: string,
    price: number
}

type searchValueState = searchValue[]

const AssetSelectorModal = ({showCallback, title,addAsset}: AssetSelectorProps) => {
    const [searchValue, setSearchValue] = useState<searchValueState>([])
    const searchCrypto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target
        if (value.length > 0) {
            const filteredData = Cryptos.filter((crypto) => crypto.name.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5)
            await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${filteredData.map((crypto) => crypto.id).join(',')}`).then(response => response.json()).then(data => {
                // get only the data we need
                const filteredData = data.map((crypto: any) => {
                    return {
                        symbol: crypto.symbol.toUpperCase(),
                        name: crypto.name,
                        id: crypto.id,
                        image: crypto.image,
                        price: crypto.current_price
                    }
                });
                setSearchValue(filteredData)
            })
        } else {
            setSearchValue([])
        }
    }

    const selectCrypto = (crypto:searchValue) => {
        setSearchValue([])
        showCallback(false);
        addAsset(crypto)
    }

    return (
        <div className={styles.modalFog}>
            <div className={styles.modal}>
                <div className={styles.closeIconContainer}>
                    <FontAwesomeIcon icon={faXmark} onClick={() => showCallback(false)}/>
                </div>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        <h2>{title}</h2>
                    </div>
                    <div className={styles.modalForm}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Search a cryptocurrency</div>
                            <input type={"text"} className={styles.inputClass} placeholder={'Search...'}
                                   onChange={searchCrypto}/>
                        </div>
                        {
                            searchValue.length > 0 ? searchValue.map(
                                (value, index) => (
                                    <div className={styles.searchResultContainer} key={index} onClick={() => selectCrypto(value)}>
                                        <Image src={value.image} width={30} height={30} alt={"Crypto logo"}/>
                                        <div className={styles.searchResultName}>{value.name}</div>
                                        <div className={`${styles.searchResultSymbol} txtGrey`}>{value.symbol}</div>
                                    </div>
                                )) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default AssetSelectorModal