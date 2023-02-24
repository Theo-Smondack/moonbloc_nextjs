import Layout from "../components/layout/layout";
import {ReactElement, useEffect, useState} from "react";
import {NextPageWithLayout} from "./_app";
import Cryptotable from "../components/cryptotable/cryptotable";
import Pagination from "../components/pagination/pagination";
import {useRouter} from "next/router";
import {CryptoData} from "../types/cryptoData";
import useWatchlist from "../utils/hooks/useWatchList";

const Watchlist: NextPageWithLayout = () => {
    const router = useRouter();
    const [_page, setPage] = useState<number>(1)
    const [maxPage, setMaxPage] = useState<number>()
    const {watchlist} = useWatchlist()

    const getMaxPage = (watchlist: CryptoData['id'][]): number => {
        return Math.ceil(watchlist.length / 100) === 0 ? 1 : Math.ceil(watchlist.length / 100)
    }

    useEffect(() => {
        const _maxPage = getMaxPage(watchlist)
        setMaxPage(_maxPage);
    }, [])



    useEffect(() => {
        let getPage: number = 1;
        if (router.query.page && maxPage) {
            getPage = parseInt(router.query.page as string)
            getPage === 1 ? router.push('/watchlist/', undefined, {shallow: true}) : null
            getPage > maxPage ? router.push({pathname: '/watchlist/', query: {page: maxPage}}, undefined, {shallow: true}) : null
        }
        setPage(getPage);
    }, [router])

    const handlePageChange = (paginationPage: number): void => {
        router.push({
            pathname: '/watchlist/',
            query: {page: paginationPage.toString()}
        })
        setPage(paginationPage)
    }

    return (
        <>
            {watchlist && <Cryptotable page={_page} isWatchlist={true}/>}
            {maxPage && maxPage > 1 && <Pagination pageCallback={handlePageChange} currentPage={_page} totalPages={maxPage}/>}
        </>
    )
}

Watchlist.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default Watchlist