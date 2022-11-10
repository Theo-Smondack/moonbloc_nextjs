import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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
            <Navbar/>
            {page}
            <Footer/>
        </Layout>
    )
}
