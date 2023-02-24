import {NextPageWithLayout} from "../_app";
import React, {ReactElement, useEffect} from "react";
import Layout from "../../components/layout/layout";
import {useRouter} from "next/router";
import useSWR from "swr";
import {CryptoDataInfo} from "../../types/cryptoData";
import {defaultDataFetcher} from "../../utils/fetchers";
import CryptoChart from "../../components/cryptoChart/cryptoChart";
import styles from './cryptoDetails.module.css'
import Image from "next/image";
import htmlParser from "html-react-parser";
import CryptoUrls from "../../components/cryptoUrls/cryptoUrls";
import {useCurrencyContext} from "../../context/currency";
import LoadingCryptoDetails from "./loadingCryptoDetails";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {useWatchlistContext} from "../../context/watchlist";
import {ModalType} from "../../components/navbar/authButtons";
import {useSession} from "next-auth/react";
import {useAuthModalContext} from "../../context/authModal";
import useWatchlist from "../../utils/hooks/useWatchList";


function convertTextWithUrls(text: string) {
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const text1=text.replace(exp, "<a href='$1'>$1</a>");
    const exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return htmlParser(text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>'));
}
const CryptoDetails: NextPageWithLayout = () => {
    const router = useRouter();
    const session = useSession();
    const {setModalState} = useAuthModalContext();
    const {id} = router.query;
    const currencyContext = useCurrencyContext();
    const {watchlist,setWatchlist} = useWatchlistContext()
    const userWatchlist = useWatchlist();
    const convert = currencyContext.state.currency?.value.toLowerCase();
    const symbol = currencyContext.state.currency?.symbol;
    const url: string = `/api/cryptocurrency/${id}?convert=${convert}`;

    const updateWatchlist = (id: string) => {
        if (!watchlist.includes(id)) {
            setWatchlist([...watchlist, id])
        } else {
            watchlist.splice(watchlist.indexOf(id), 1)
            setWatchlist([...watchlist])
        }
    }
    const handleStarClick = async (target: EventTarget, id: string) => {
        if (session.status !== 'authenticated') {
            setModalState({show: true, type: ModalType.Login})
            return
        }
        updateWatchlist(id);
    }

    useEffect(() => {
        if (session.status !== 'authenticated') {
            return
        }
        if (session.data.user) {
            const userEmail = session.data.user.email as string
            (async () => {
                await fetch(`/api/user/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        update: {watchlist: watchlist}
                    })
                })
            })();
        }
    }, [watchlist])

    const {data, error} = useSWR<CryptoDataInfo>(url, defaultDataFetcher)
    if (error) return <div className='container'> failed to load </div>
    if (!data) return <LoadingCryptoDetails/>
    let price;
    if(data.price * 1000 > 0){
        price = data.price
    }else{
        price = (Math.floor(data.price*100)/100).toLocaleString()
    }
    return (
        <>
            { userWatchlist && <div className={styles.container}>
                <div className={styles.headContainer}>
                    <div className={styles.titleContainer}>
                        <Image src={data.logo} width={32} height={32}  alt="Crypto logo"/>
                        <h2>{data.name} <span className='txtGrey' style={{fontWeight:300}}>{data.symbol}</span></h2>
                        <FontAwesomeIcon icon={faStar} style={{fontSize: 18}} className={`${styles.star} ${watchlist.includes(data.id) ? styles.watchlisted : ''}`}
                                         onClick={(e) => handleStarClick(e.target,data.id)}/>
                    </div>
                    <div className={styles.priceContainer}>
                        <h2>{price}{symbol}</h2>
                        <div className={styles.percentChangeContainer}>
                            {data.price_change_percentage_24h > 0 ? <span className={`positive`}>+{data.price_change_percentage_24h.toFixed(2)}%</span> : <span className={`negative`}>{data.price_change_percentage_24h.toFixed(2)}%</span>}
                        </div>
                    </div>
                </div>
                <CryptoChart id={id as string}/>
                <div className={styles.bottomContainer}>
                    <div className={styles.descContainer}>
                        <h2 className={styles.title}>Description</h2>
                        {convertTextWithUrls(data.description)}
                    </div>
                    <div className={styles.linksContainer}>
                        <h2 className={styles.title}>Links</h2>
                        <CryptoUrls urls={data.urls}/>
                    </div>
                </div>
            </div>}
        </>

    )
}

CryptoDetails.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default CryptoDetails