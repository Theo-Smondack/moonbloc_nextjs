import styles from './profilPopup.module.css'
import {signOut, useSession} from "next-auth/react";
import {profilPopUpProps} from "../../types/props";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faUserCircle, faWallet} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const ProfilPopup = ({refProp,onMouseEnter}: profilPopUpProps) => {
    const router = useRouter()
    const {data} = useSession()
    const handleLogout = async () => {
        await signOut();
        await router.push('/');
    };

    return (
        <div ref={refProp} className={styles.profilePopup} onMouseEnter={onMouseEnter}>
            <div className={styles.profileSideBarContainer}>
                <div className={styles.profileSideBarContainerTop}>
                    <h2>Hi, {data?.user?.name}</h2>
                </div>
                <div className={styles.profileSideBarContainerBody}>
                    <Link href='/profil'>
                        <div className={styles.profileSideBarContainerBodyItem}>
                            <FontAwesomeIcon icon={faUserCircle} className={styles.itemIcon}/>
                            Profil
                        </div>
                    </Link>
                    <Link href="/watchlist">
                        <div className={styles.profileSideBarContainerBodyItem}>
                            <FontAwesomeIcon icon={faStar} className={styles.itemIcon}/>
                            Watchlist
                        </div>
                    </Link>
                    <Link href='/portfolio'>
                        <div className={styles.profileSideBarContainerBodyItem}>
                            <FontAwesomeIcon icon={faWallet} className={styles.itemIcon}/>
                            Portfolio
                        </div>
                    </Link>
                </div>

                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>

            </div>
        </div>
    )

}
export default ProfilPopup