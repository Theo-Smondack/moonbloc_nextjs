
import {LayoutProps} from "../../types/props";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import AuthModal from "../authModal/authModal";
import {useAuthModalContext} from "../../context/authModal";
import StatusPopUp from "../statusPopup/statusPopUp";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useWalletsContext} from "../../context/wallets";
import {getDataFromApi} from "../../utils/toolFunctions";

export default function Layout({children}: LayoutProps) {
    const {modalState} = useAuthModalContext()
    const {data,status} = useSession()
    const {setWallets} = useWalletsContext()

    useEffect(() => {
        if (status === 'authenticated' && data?.user?.email) {
            getDataFromApi(`/api/user/wallet/find?userEmail=${data?.user?.email}`).then(r => setWallets(r.wallets))
        }
    }, [status])
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