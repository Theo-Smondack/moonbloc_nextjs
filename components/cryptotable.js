import useSWR from "swr";
import styles from './cryptotable.module.css'
import Cryptorow from "./cryptorow";
import Image from "next/image";

const fetcher = async url => {
    const res = await fetch(url)
    if(!res.ok){
        const error = new Error('An error occurred while fetching the data.')
        // Attach extra info to the error object.
        error.info = await res.json()
        error.status = res.status
        throw error;
    }
    return res.json();
}

export default function Cryptotable() {
    const {data,error} = useSWR('/api/cryptocurrency/list',fetcher)
    if (error) return <div className='container'> failed to load </div>
    if (!data) return <div className='container'> loading... </div>
    console.log(data)
    return(
            <div className='container'>
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
                    {data.map(({id,cmc_rank,name,symbol,quote,total_supply}) => (
                        <tr key={id}>
                            <td>{cmc_rank}</td>
                            <td>
                                <div className={styles.name_div}>
                                    <Image
                                        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                                        width={24}
                                        height={24}
                                        alt="Test"
                                    />
                                    <p>{name}</p>
                                    <p>{symbol}</p>

                                </div>
                            </td>
                            <td>{quote.EUR.price.toLocaleString(undefined,{maximumFractionDigits:2})} €</td>
                            <td>{Math.round(quote.EUR.percent_change_1h*100)/100}</td>
                            <td>{Math.round(quote.EUR.percent_change_24h*100)/100}</td>
                            <td>{Math.round(quote.EUR.percent_change_7d*100)/100}</td>
                            <td>{quote.EUR.market_cap.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                            <td>{quote.EUR.volume_24h.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                            <td>{Math.round(total_supply).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    )
}