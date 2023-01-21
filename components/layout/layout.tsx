import Head from "next/head";
import {LayoutProps} from "../../types/props";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
export const siteTitle:string = 'MoonBloc';



export default function Layout({children}:LayoutProps){
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/*<div style={{minHeight:"100vh",position:"relative"}}>*/}
                <Navbar/>
                <main>{children}</main>
                <Footer/>
            {/*</div>*/}

        </>
    )
}