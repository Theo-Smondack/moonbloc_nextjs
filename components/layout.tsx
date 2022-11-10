import Head from "next/head";
import {LayoutProps} from "../types/props";
export const siteTitle:string = 'MoonBloc';



export default function Layout({children}:LayoutProps){
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