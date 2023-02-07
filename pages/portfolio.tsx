import Layout from "../components/layout/layout";
import {ReactElement} from "react";
import {NextPageWithLayout} from "./_app";

const Portfolio:NextPageWithLayout = () => {
    return (
        <div>
            <p>This is portfolio</p>
        </div>
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