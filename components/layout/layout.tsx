import Head from "next/head";
import {LayoutProps} from "../../types/props";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import AuthModal from "../authModal/authModal";
import {useAuthModalContext} from "../../context/authModal";
import StatusPopUp from "../statusPopup/statusPopUp";

export const siteTitle: string = 'MoonBloc';


export default function Layout({children}: LayoutProps) {
    const {modalState} = useAuthModalContext()
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <StatusPopUp/>
            {modalState.show ? <AuthModal/> : null}
            <Navbar/>
            <main>{children}</main>
            <Footer/>
        </>
    )
}