import {NextPageWithLayout} from "../_app";
import React, {ReactElement} from "react";
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


function convertTextWithUrls(text: string) {
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const text1=text.replace(exp, "<a href='$1'>$1</a>");
    const exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return htmlParser(text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>'));
}
const CryptoDetails: NextPageWithLayout = () => {
    const router = useRouter();
    const {id} = router.query;

    const url: string = `/api/cryptocurrency/${id}`;
    const {data, error} = useSWR<CryptoDataInfo>(url, defaultDataFetcher)
    if (error) return <div className='container'> failed to load </div>
    if (!data) return <p>Loading...</p>
    console.log(data)
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <Image src={data.logo} width={32} height={32}  alt="Crypto logo"/>
                <h2>{data.name} <span className='txtGrey' style={{fontWeight:300}}>{data.symbol}</span></h2>
            </div>
            <CryptoChart/>
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
        </div>
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