import React, {ReactElement, useEffect, useState} from "react";
import Layout from "../../components/layout/layout";
import {NextPageWithLayout} from "../_app";
import {useRouter} from "next/router";
import {Asset, AssetList, WalletResponse} from "../../types/wallet";
import useSWR from "swr";
import {defaultDataFetcher} from "../../helpers/fetchers";
import styles from './portfoliopage.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import AssetSelectorModal, {searchValue} from "../../components/portfolio/portfolioPage/assetSelectorModal";
import AssetsList from "../../components/portfolio/portfolioPage/assetsList";
import {useCurrencyContext} from "../../context/currency";

const PortfolioPage: NextPageWithLayout = () => {
    const {query: {id}} = useRouter()
    const [url, setUrl] = useState<string | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const {state:{currency}} = useCurrencyContext()

    const openModal = (show:boolean) => {
        setShowModal(show)
    }
    const [portfolio, setPortfolio] = useState<WalletResponse['wallet']>({
        walletTitle: '',
        walletID: '',
        assets: []
    })
    useEffect(() => {
        if (id) {
            setUrl(`/api/user/wallet/find/${id}?currency=${currency ? currency.value : 'usd'}`)
        }
    }, [id, currency])

    const {data, error} = useSWR<WalletResponse>(url, defaultDataFetcher)


    useEffect(() => {
        if (data && !error) {
            setPortfolio(data.wallet);
        }
    }, [data, error]);

    const addAsset = (asset: searchValue) => {
        const newAsset : Asset = {
            id: asset.id, image: asset.image, name: asset.name, price: asset.price, quantity: 0, symbol: asset.symbol, total: 0
        }
        const portfolioAssets = portfolio.assets
        const newAssets:AssetList = [...portfolioAssets,newAsset]
        setPortfolio({...portfolio, assets: newAssets})
    }

    if (error) return <div className='container'> failed to load wallet</div>
    if (!data) return <div>Loading</div>
    const {walletTitle, walletID, assets} = portfolio;
    return (
        <div className={styles.container}>
            {showModal ? <AssetSelectorModal showCallback={openModal} title={`Add crypto to ${walletTitle}`} addAsset={addAsset}/> : null}
            <div className={styles.headContainer}>
                <h1>{walletTitle}</h1>
                <button className={`bgBlueButton ${styles.addTransactionButton}`}
                        onClick={() => openModal(true)}>
                    <FontAwesomeIcon icon={faCirclePlus} className={styles.icon}/>
                    <p>Add asset</p>
                </button>
            </div>
            {
                assets.length ?
                    <AssetsList Assets={assets}/>
                    :
                    <div className={styles.noAssetContainer}>There is no cryptocurrencies in this portfolio</div>
            }
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