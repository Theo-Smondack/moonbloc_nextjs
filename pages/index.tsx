import Layout from "../components/layout";
import Cryptotable from "../components/cryptotable";
import {NextPageWithLayout} from "./_app";
import {ReactElement, useEffect, useState} from "react";
import Pagination from "../components/pagination";
import {useRouter} from "next/router";

const Home: NextPageWithLayout = () => {
    const router = useRouter();
    const [_page, setPage] = useState<number>(1)

    useEffect(() => {
        let getPage:number = 1;
        if (router.query.page) {
            getPage = parseInt(router.query.page as string)
        }
        getPage === 1?router.push('/',undefined,{shallow:true}):null

        setPage(getPage);
    }, [router])


    const handlePageChange = (paginationPage: number): void => {
        router.push({
            pathname: '/',
            query: {page: paginationPage.toString()}
        })
        setPage(paginationPage)
    }

    return (
        <div>
            <Cryptotable page={_page}/>
            <Pagination pageCallback={handlePageChange} currentPage={_page}/>
        </div>
    )
}


Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Home