import Layout from "../components/layout/layout";
import {ReactElement} from "react";
import {NextPageWithLayout} from "./_app";

const Watchlist:NextPageWithLayout = () => {
    return (
        <div>
            <p>This is watchlist</p>
        </div>
    )
}

Watchlist.getLayout = function getLayout(page:ReactElement) {
    return(
        <Layout>
            {page}
        </Layout>
    )
}
export default Watchlist