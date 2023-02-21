import useSWR from "swr";
import styles from './cryptotable.module.css'
import Image from "next/image";
import {useCurrencyContext} from "../../context/currency";
import React from "react";
import {Currency} from "../../types/currency";
import {CryptoData, CryptoDataList} from "../../types/cryptoData";
import {CryptotableProps} from "../../types/props";
import {isNegative} from "../../utils/toolFunctions";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoadingCryptotable from "./loadingCryptotable";
import Link from "next/link";
import {defaultDataFetcher} from "../../utils/fetchers";

const Cryptotable = ({page}: CryptotableProps) => {
    const value = useCurrencyContext();
    const currencySelected: Currency | undefined = value.state.currency;
    const _symbol: string | undefined = currencySelected?.symbol;
    let url: string = `/api/cryptocurrency/list?convert=${currencySelected?.value}&page=1`;
    if (page) {
        url = `/api/cryptocurrency/list?convert=${currencySelected?.value}&page=${page}`
    }
    const {data, error} = useSWR<CryptoDataList>(url, defaultDataFetcher)
    if (error) return <div className='container'> failed to load </div>
    if (!data) return <LoadingCryptotable/>
    return (
        <div className='container' style={{overflow: "auto"}}>
            <table className={styles.crypto_table}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>1h %</th>
                    <th>24h %</th>
                    <th>7d %</th>
                    <th>Market cap</th>
                    <th>Volume(24h)</th>
                </tr>
                </thead>
                <tbody>
                {data.map(({id, market_cap_rank, name,market_cap,percent_change_24h,percent_change_1h,percent_change_7d,price,volume_24h,symbol,image,}:CryptoData) => (
                    <Link href={`/cryptodetails/${id}`} key={id}>
                        <tr key={id}>
                            <td>{market_cap_rank}</td>
                            <td>
                                <div className={styles.name_div}>
                                    <Image
                                        src={image}
                                        width={24}
                                        height={24}
                                        alt="Crypto logo"
                                    />
                                    <p>{name}</p>
                                    <p className={'txtGrey'} style={{fontWeight: 300}}>{symbol}</p>

                                </div>
                            </td>
                            <td>{price.toLocaleString(undefined, {minimumFractionDigits: 2})} {_symbol}</td>
                            <td className={isNegative(percent_change_1h) ? styles.negative : styles.positive}>
                                {percent_change_1h.toLocaleString(undefined, {minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(percent_change_1h) ? faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(percent_change_1h) ? styles.negative : styles.positive}
                            />
                            </td>
                            <td className={isNegative(percent_change_24h) ? styles.negative : styles.positive}>
                                {percent_change_24h.toLocaleString(undefined, {minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(percent_change_24h) ? faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(percent_change_24h) ? styles.negative : styles.positive}
                            />
                            </td>
                            <td className={isNegative(percent_change_7d) ? styles.negative : styles.positive}>
                                {percent_change_7d.toLocaleString(undefined, {minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(percent_change_7d) ? faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(percent_change_7d) ? styles.negative : styles.positive}
                            />
                            </td>
                            <td>{market_cap.toLocaleString(undefined, {minimumFractionDigits: 2})} {_symbol}</td>
                            <td>{volume_24h.toLocaleString(undefined, {minimumFractionDigits: 2})} {_symbol}</td>
                        </tr>
                    </Link>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Cryptotable;