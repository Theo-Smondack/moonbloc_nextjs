import Layout from "../components/layout";
import {ReactElement} from "react";
import Cryptotable from "../components/cryptotable";

export default function Cryptocurrencies() {
    return (
        <div>
            <Cryptotable/>
        </div>

    )
}

Cryptocurrencies.getLayout = function getLayout(page:ReactElement) {
    return(
        <Layout>
            {page}
        </Layout>
    )
}
