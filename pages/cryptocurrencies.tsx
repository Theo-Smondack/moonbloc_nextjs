import Layout from "../components/layout";
import {ReactElement} from "react";

export default function Cryptocurrencies() {
    return (
        <div>
            <p>This is cryptocurrencies</p>
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
