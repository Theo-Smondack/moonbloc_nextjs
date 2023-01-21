import Layout from "../components/layout/layout";
import {ReactElement} from "react";

export default function Watchlist() {
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
