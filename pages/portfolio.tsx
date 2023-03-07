import Layout from "../components/layout/layout";
import {ReactElement} from "react";
import {NextPageWithLayout} from "./_app";
import PortfolioGrid from "../components/portfolio/portfolioGrid";

const Portfolio:NextPageWithLayout = () => {
    return (
        <>
            <PortfolioGrid/>
        </>
    )
}

Portfolio.getLayout = function getLayout(page:ReactElement) {
    return(
        <Layout>
            {page}
        </Layout>
    )
}
export default Portfolio