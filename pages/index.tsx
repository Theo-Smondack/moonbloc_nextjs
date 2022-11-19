import Layout from "../components/layout";
import Cryptotable from "../components/cryptotable";
import {NextPageWithLayout} from "./_app";
import {ReactElement, useState} from "react";
import Pagination from "../components/pagination";
import {useRouter} from "next/router";

const Home: NextPageWithLayout = () => {
    // const router = useRouter();
    // const {page} = router.query
    const [_page,setPage] = useState<number>(1);

    const handlePageChange = (paginationPage:number):void => {
        setPage(paginationPage)
    }
    //
    // if (typeof page === "string") {
    //     if(!isNaN(parseInt(page))){
    //         setPage(parseInt(page))
    //     }
    // }


    return (
        <div>
            <Cryptotable page={_page}/>
            <Pagination pageCallback={handlePageChange} currentPage={_page}/>
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