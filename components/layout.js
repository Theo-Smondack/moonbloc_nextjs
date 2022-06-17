import Head from "next/head";
export const siteTitle = 'MoonBloc';

export default function Layout({children}){
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>{children}</main>
        </>
    )
}