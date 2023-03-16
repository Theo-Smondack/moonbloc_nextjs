import React, {ReactElement, useEffect, useState} from "react";
import Layout from "../../components/layout/layout";
import {NextPageWithLayout} from "../_app";
import {useRouter} from "next/router";
import {WalletResponse} from "../../types/wallet";
import useSWR from "swr";
import {defaultDataFetcher} from "../../utils/fetchers";
import styles from './portfoliopage.module.css'
import NoAssetWallet from "../../components/portfolio/portfolioPage/noAssetWallet";

const PortfolioPage: NextPageWithLayout = () => {
    const {query: {id}} = useRouter()
    const [url, setUrl] = useState<string | null>(null)
    const [portfolio, setPortfolio] = useState<WalletResponse['wallet']>({
        walletTitle: '',
        walletID: '',
        assets: {}
    })
    useEffect(() => {
        if (id) {
            setUrl(`/api/user/wallet/find/${id}`)
        }
    }, [id])

    const {data, error} = useSWR<WalletResponse>(url, defaultDataFetcher)

    useEffect(() => {
        if (data && !error) {
            setPortfolio(data.wallet);
        }
    }, [data, error]);

    if (error) return <div className='container'> failed to load </div>
    if (!data) return <div>Loading</div>
    const {walletTitle, walletID, assets} = portfolio;
    return (
        <div className={styles.container}>
            <h1>{walletTitle}</h1>
            {Object.keys(assets).length ? <div>Il y a des assets</div> : <NoAssetWallet walletID={walletID as string} walletTitle={walletTitle}/>}
        </div>
    );
}

PortfolioPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default PortfolioPage;