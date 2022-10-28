import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Cryptotable from "../components/cryptotable";

export default function Home() {
    return (
        <div>
            <Cryptotable/>
        </div>
    )
}


Home.getLayout = function getLayout(page) {
    return (
            <Layout>
                <Navbar/>
                {page}
                {/*<Footer/>*/}
            </Layout>
    )
}
