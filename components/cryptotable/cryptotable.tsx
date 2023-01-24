import useSWR from "swr";
import styles from './cryptotable.module.css'
import Image from "next/image";
import {useCurrencyContext} from "../../context/currency";
import React from "react";
import {Currency} from "../../types/currency";
import {CryptoData} from "../../types/cryptoData";
import {CryptotableProps} from "../../types/props";
import {isNegative} from "../../utils/toolFunctions";
import {faCaretDown,faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoadingCryptotable from "./loadingCryptotable";


const fetcher = async (url: RequestInfo | URL) => {
    const res = await fetch(url)
    if (!res.ok) {
        const error = new SwrErr('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        error.info = await res.json()
        error.status = res.status
        error.getErrorMessage();
        throw error;
    }
    return res.json();
}

const Cryptotable: React.FC<CryptotableProps> = (props) => {
    const value = useCurrencyContext();
    const currencySelected: Currency | undefined = value.state.currency;
    const _symbol: string | undefined = currencySelected?.symbol;
    let url:string = `/api/cryptocurrency/list/${currencySelected?.value}`;
    if (props.page){
        url = `/api/cryptocurrency/list/${currencySelected?.value}?page=${props.page?.toString()}`
    }
    const {data, error} = useSWR<CryptoData[]>(url, fetcher)
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
                    <tr key={id}>
                        <td>{cmc_rank}</td>
                        <td>
                            <div className={styles.name_div} onClick={() => console.log(`id: ${id} name: ${name}`)}>
                                <Image
                                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                                    width={24}
                                    height={24}
                                    alt="Test"
                                />
                                <p>{name}</p>
                                <p className={'txtGrey'} style={{fontWeight:300}}>{symbol}</p>

                            </div>
                        </td>
                        <td>{quote[`${currencySelected?.value}`].price.toLocaleString(undefined,{minimumFractionDigits: 2})} {_symbol}</td>
                        <td className={isNegative(quote[`${currencySelected?.value}`].percent_change_1h)?styles.negative : styles.positive}>
                            {quote[`${currencySelected?.value}`].percent_change_1h.toLocaleString(undefined,{minimumFractionDigits: 2})} % <FontAwesomeIcon
                                icon={isNegative(quote[`${currencySelected?.value}`].percent_change_1h)?faCaretDown : faCaretUp}
                                style={{fontSize: 12}}
                                className={isNegative(quote[`${currencySelected?.value}`].percent_change_1h)?styles.negative : styles.positive}
                            />
                        </td>
                        <td className={isNegative(quote[`${currencySelected?.value}`].percent_change_24h)?styles.negative : styles.positive}>
                            {quote[`${currencySelected?.value}`].percent_change_24h.toLocaleString(undefined,{minimumFractionDigits: 2})} % <FontAwesomeIcon
                            icon={isNegative(quote[`${currencySelected?.value}`].percent_change_24h)?faCaretDown : faCaretUp}
                            style={{fontSize: 12}}
                            className={isNegative(quote[`${currencySelected?.value}`].percent_change_24h)?styles.negative : styles.positive}
                        />
                        </td>
                        <td className={isNegative(quote[`${currencySelected?.value}`].percent_change_7d)?styles.negative : styles.positive}>
                            {quote[`${currencySelected?.value}`].percent_change_7d.toLocaleString(undefined,{minimumFractionDigits: 2})} % <FontAwesomeIcon
                            icon={isNegative(quote[`${currencySelected?.value}`].percent_change_7d)?faCaretDown : faCaretUp}
                            style={{fontSize: 12}}
                            className={isNegative(quote[`${currencySelected?.value}`].percent_change_7d)?styles.negative : styles.positive}
                        />
                        </td>
                        <td>{quote[`${currencySelected?.value}`].market_cap.toLocaleString(undefined,{minimumFractionDigits: 2})} {_symbol}</td>
                        <td>{quote[`${currencySelected?.value}`].volume_24h.toLocaleString(undefined,{minimumFractionDigits: 2})} {_symbol}</td>
                        <td>{Math.round(total_supply).toLocaleString(undefined)} {symbol}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Cryptotable;