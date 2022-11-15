import Layout from "../components/layout";
import Cryptotable from "../components/cryptotable";
import {NextPageWithLayout} from "./_app";
import {ReactElement} from "react";

const Home: NextPageWithLayout = () => {
    return (
        <div>
            <Cryptotable/>
        </div>
    )
}


Home.getLayout = function getLayout(page:ReactElement) {
    return (
            <Layout>
                {page}
            </Layout>
    )
}

export default Home