import Layout from '../components/layout/layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import PortfolioGrid from '../components/portfolio/portfolioGrid';
import WalletModalProvider from '../context/walletModal';

const Portfolio: NextPageWithLayout = () => {
    return (
        <>
            <WalletModalProvider>
                <PortfolioGrid/>
            </WalletModalProvider>
        </>
    )
}

Portfolio.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default Portfolio