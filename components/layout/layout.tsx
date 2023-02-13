
import {LayoutProps} from "../../types/props";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import AuthModal from "../authModal/authModal";
import {useAuthModalContext} from "../../context/authModal";
import StatusPopUp from "../statusPopup/statusPopUp";




export default function Layout({children}: LayoutProps) {
    const {modalState} = useAuthModalContext()
    return (
        <>
            <StatusPopUp/>
            {modalState.show ? <AuthModal/> : null}
            <Navbar/>
            <main>{children}</main>
            <Footer/>
        </>
    )
}