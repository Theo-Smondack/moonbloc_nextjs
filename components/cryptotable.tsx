import useSWR from "swr";
import styles from './cryptotable.module.css'
import Image from "next/image";
import {useCurrencyContext} from "../context/currency";
import React from "react";
import {Currency} from "../types/currency";
import {CryptoData} from "../types/cryptoData";


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

const Cryptotable: React.FC = () => {
    const value = useCurrencyContext();
    const currencySelected: Currency | undefined = value.state.currency;
    const _symbol: string | undefined = currencySelected?.symbol;
    const {data, error} = useSWR<CryptoData[]>(`/api/cryptocurrency/list/${currencySelected?.value}`, fetcher)
    if (error) return <div className='container'> failed to load </div>
    if (!data) return <div className='container'> loading... </div>
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
                        <td>{quote[`${currencySelected?.value}`].price.toFixed(2)} {_symbol}</td>
                        <td>{Math.round(quote[`${currencySelected?.value}`].percent_change_1h * 100) / 100}</td>
                        <td>{Math.round(quote[`${currencySelected?.value}`].percent_change_24h * 100) / 100}</td>
                        <td>{Math.round(quote[`${currencySelected?.value}`].percent_change_7d * 100) / 100}</td>
                        <td>{quote[`${currencySelected?.value}`].market_cap.toFixed(2)} {_symbol}</td>
                        <td>{quote[`${currencySelected?.value}`].volume_24h.toFixed(2)} {_symbol}</td>
                        <td>{Math.round(total_supply)} {_symbol}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Cryptotable;