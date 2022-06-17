import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Watchlist() {
    return (
        <div>
            <p>This is watchlist</p>
        </div>
    )
}

Watchlist.getLayout = function getLayout(page) {
    return(
        <Layout>
            <Navbar/>
            {page}
            <Footer/>
        </Layout>
    )
}
