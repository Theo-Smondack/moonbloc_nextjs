import styles from './navbar.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ThemeSwitch from '../ThemeSwitch';
import { useState } from 'react';
import CurrencyModal from '../currencyModal/currencyModal';
import AuthButtons from './authButtons';
import { useSession } from 'next-auth/react';
import ProfilButton from './profilButton';


export default function Navbar() {
    const { status } = useSession()
    const [isActive, setIsActive] = useState<boolean>(false)
    const hamburgerClassname = isActive ? `${styles.hamburger} ${styles.active}` : styles.hamburger
    const toggleMenuClassname = isActive ? `${styles.toggleMenu} ${styles.active}` : styles.toggleMenu

    const handleIsActive = (active: boolean): void => {
        setIsActive(active)
    }

    return (
        <div>
            <div className={styles.containerNav}>
                <div className={`${styles.headNav}`}>
                    <div className={styles.containerHeadNav}>
                        <div className={styles.rightContainerHeadNav}>
                            <CurrencyModal pos={'relative'}/>
                            <div style={{ display: 'flex' }}>
                                <ThemeSwitch/>
                            </div>
                            {status !== 'authenticated' ? <AuthButtons/> : <ProfilButton/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.containerNav}>
                <div className={`${styles.mainNav} container`}>
                    <Image src="/images/favicon.png"
                           height={50}
                           width={50}
                           alt="MoonBloc logo"
                    />
                    <Link href="/">
                        <div className={styles.moonBlocTitleDiv}
                             onClick={() => isActive ? handleIsActive(!isActive) : null}>
                            <h1>Moon</h1><h1 className={'titleBlue'}>Bloc</h1>
                        </div>
                    </Link>
                    <div className={styles.mainNavContainer}>
                        <Link href="/">
                            <div>
                                Cryptocurrencies
                            </div>
                        </Link>
                    </div>
                    <div className={styles.searchContainer}>
                        <div className={styles.sInputContainer}>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                style={{ fontSize: 16 }}
                            />
                            <input type="text" placeholder="Searching for ..."/>
                        </div>
                    </div>

                    <div className={styles.hamburgerContainer}>
                        <div className={styles.mainNavResp}>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                style={{ fontSize: 21 }}
                                onClick={() => alert('search')}
                            />
                        </div>
                        <div className={styles.mainNavResp}>
                            <div className={hamburgerClassname} onClick={() => handleIsActive(!isActive)}>
                                <span className={styles.bar}></span>
                                <span className={styles.bar}></span>
                                <span className={styles.bar}></span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className={toggleMenuClassname}>
                <Link href="/">
                    <div onClick={() => handleIsActive(!isActive)}>
                        <div>
                            Cryptocurrencies
                        </div>
                    </div>
                </Link>
                <div className={styles.toggleButtonContainer}>
                    <CurrencyModal pos={undefined}/>
                    <div>
                        <ThemeSwitch/>
                    </div>
                </div>
                {status !== 'authenticated' ? <AuthButtons setNavbar={handleIsActive}/> : <ProfilButton isOpen={isActive} setNavbar={handleIsActive}/>}
            </div>
            <div>

            </div>
        </div>

    )
}