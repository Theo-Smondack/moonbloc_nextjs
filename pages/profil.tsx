import Layout from '../components/layout/layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Profil:NextPageWithLayout = () => {
    return (
        <div>
            <p>This is profil</p>
        </div>
    )
}

Profil.getLayout = function getLayout(page:ReactElement) {
    return(
        <Layout>
            {page}
        </Layout>
    )
}
export default Profil