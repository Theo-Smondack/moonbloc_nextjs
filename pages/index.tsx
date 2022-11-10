import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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
                <Navbar/>
                {page}
                {/*<Footer/>*/}
            </Layout>
    )
}

export default Home