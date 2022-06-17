import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Home() {
    return (
        <div>
            <div>This is home</div>
        </div>
    )
}

Home.getLayout = function getLayout(page) {
    return(
        <Layout>
            <Navbar/>
            {page}
            <Footer/>
        </Layout>
    )
}
