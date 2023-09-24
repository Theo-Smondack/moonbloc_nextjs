import Layout from '../components/layout/layout';
import Cryptotable from '../components/cryptotable/cryptotable';
import { NextPageWithLayout } from './_app';
import { ReactElement, useEffect, useState } from 'react';
import Pagination from '../components/pagination/pagination';
import { useRouter } from 'next/router';
import useWatchlist from '../helpers/hooks/useWatchList';

const Home: NextPageWithLayout = () => {
    const router = useRouter();
    const [_page, setPage] = useState<number>(1)
    const { watchlist } = useWatchlist()
    const maxPage = 39

    useEffect(() => {
        let getPage: number = 1;
        if (router.query.page) {
            getPage = parseInt(router.query.page as string)
            getPage === 1 ? router.push('/', undefined, { shallow: true }) : null
            getPage > maxPage ? router.push({ pathname:'/',query:{ page:maxPage } }, undefined, { shallow: true }) : null
        }
        setPage(getPage);
    }, [router])




    const handlePageChange = (paginationPage: number): void => {
        router.push({
            pathname: '/',
            query: { page: paginationPage.toString() },
        })
        setPage(paginationPage)
    }



    return (
        <div>
            {watchlist && <Cryptotable page={_page} isWatchlist={false}/>}
            <Pagination pageCallback={handlePageChange} currentPage={_page} totalPages={maxPage}/>
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