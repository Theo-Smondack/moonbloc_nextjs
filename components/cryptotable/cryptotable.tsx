import useSWR from "swr";
import styles from './cryptotable.module.css'
import Image from "next/image";
import {useCurrencyContext} from "../../context/currency";
import React from "react";
import {Currency} from "../../types/currency";
import {CryptoDataList} from "../../types/cryptoData";
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
    let url: string = `/api/cryptocurrency/list/${currencySelected?.value}`;
    if (page) {
        url = `/api/cryptocurrency/list/${currencySelected?.value}?page=${page?.toString()}`
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
                    <th>Circulating Supply</th>
                </tr>
                </thead>
                <tbody>
                {data.map(({id, cmc_rank, name, symbol, quote, total_supply}) => (
                    <Link href={`/cryptodetails/${id}`} key={id}>
                        <tr key={id}>
                            <td>{cmc_rank}</td>
                            <td>
                                <div className={styles.name_div} onClick={() => console.log(`id: ${id} name: ${name}`)}>
                                    <Image
                                        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                                        width={24}
                                        height={24}
                                        alt="Crypto logo"
                                    />
                                    <p>{name}</p>
                                    <p className={'txtGrey'} style={{fontWeight: 300}}>{symbol}</p>

                                </div>
                            </td>
                            <td>{quote[`${currencySelected?.value}`].price.toLocaleString(undefined, {minimumFractionDigits: 2})} {_symbol}</td>
                            <td className={isNegative(quote[`${currencySelected?.value}`].percent_change_1h) ? styles.negative : styles.positive}>
                                {quote[`${currencySelected?.value}`].percent_change_1h.toLocaleString(undefined, {minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(quote[`${currencySelected?.value}`].percent_change_1h) ? faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(quote[`${currencySelected?.value}`].percent_change_1h) ? styles.negative : styles.positive}
                            />
                            </td>
                            <td className={isNegative(quote[`${currencySelected?.value}`].percent_change_24h) ? styles.negative : styles.positive}>
                                {quote[`${currencySelected?.value}`].percent_change_24h.toLocaleString(undefined, {minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(quote[`${currencySelected?.value}`].percent_change_24h) ? faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(quote[`${currencySelected?.value}`].percent_change_24h) ? styles.negative : styles.positive}
                            />
                            </td>
                            <td className={isNegative(quote[`${currencySelected?.value}`].percent_change_7d) ? styles.negative : styles.positive}>
                                {quote[`${currencySelected?.value}`].percent_change_7d.toLocaleString(undefined, {minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(quote[`${currencySelected?.value}`].percent_change_7d) ? faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(quote[`${currencySelected?.value}`].percent_change_7d) ? styles.negative : styles.positive}
                            />
                            </td>
                            <td>{quote[`${currencySelected?.value}`].market_cap.toLocaleString(undefined, {minimumFractionDigits: 2})} {_symbol}</td>
                            <td>{quote[`${currencySelected?.value}`].volume_24h.toLocaleString(undefined, {minimumFractionDigits: 2})} {_symbol}</td>
                            <td>{Math.round(total_supply).toLocaleString(undefined)} {symbol}</td>
                        </tr>
                    </Link>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Cryptotable;