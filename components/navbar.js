import styles from './navbar.module.css'
import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faCaretDown, faEuroSign, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "./ThemeSwitch";
import {ThemeProvider} from "next-themes";
import {useState} from "react";


export default function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const hamburgerClassname = isActive ? `${styles.hamburger} ${styles.active}` : styles.hamburger
    const toggleMenuClassname = isActive ? `${styles.toggleMenu} ${styles.active}` : styles.toggleMenu

    return (
        <ThemeProvider>
            <div>
                <div className={styles.containerNav}>
                    <div className={`${styles.headNav}`}>
                        <div className={styles.containerHeadNav}>
                            <div className={styles.rightContainerHeadNav}>
                                <div>
                                    <button title="Choose currency">
                            <span>
                                <FontAwesomeIcon
                                    icon={faEuroSign}
                                    style={{fontSize: 12, color: ThemeSwitch.color}}
                                />
                            </span>

                                        <span>EUR</span>
                                        <span>
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    style={{fontSize: 12, color: ThemeSwitch.color}}
                                />
                            </span>

                                    </button>
                                </div>
                                <div>
                                    <ThemeSwitch/>
                                </div>
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
                                 onClick={() => isActive ? setIsActive(!isActive) : null}>
                                <h1>MoonBloc</h1>
                            </div>
                        </Link>
                        <div className={styles.mainNavContainer}>
                            <Link href="/cryptocurrencies">
                                <div>
                                    Cryptocurrencies
                                </div>
                            </Link>
                            <Link href="/watchlist">
                                <div>
                                    Watchlist
                                </div>
                            </Link>
                        </div>
                        <div className={styles.searchContainer}>
                            <div className={styles.sInputContainer}>
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    style={{fontSize: 16, color: ThemeSwitch.color}}
                                />
                                <input type="text" placeholder="Searching for ..."/>
                            </div>
                        </div>

                        <div className={styles.hamburgerContainer}>
                            <div className={styles.mainNavResp}>
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    style={{fontSize: 21, color: ThemeSwitch.color}}
                                    onClick={() => alert('search')}
                                />
                            </div>
                            <div className={styles.mainNavResp}>
                                <div className={hamburgerClassname} onClick={() => setIsActive(!isActive)}>
                                    <span className={styles.bar}></span>
                                    <span className={styles.bar}></span>
                                    <span className={styles.bar}></span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={toggleMenuClassname}>
                    <Link href="/cryptocurrencies">
                        <div onClick={() => setIsActive(!isActive)}>
                            <div>
                                Cryptocurrencies
                            </div>

                        </div>
                    </Link>
                    <Link href="/watchlist">
                        <div onClick={() => setIsActive(!isActive)}>
                            <div>
                                Watchlist
                            </div>
                        </div>
                    </Link>
                    <div className={styles.toggleButtonContainer}>
                        <div>
                            <button title="Choose currency">
                            <span>
                                <FontAwesomeIcon
                                    icon={faEuroSign}
                                    style={{fontSize: 12, color: ThemeSwitch.color}}
                                />
                            </span>

                                <span>EUR</span>
                                <span>
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    style={{fontSize: 12, color: ThemeSwitch.color}}
                                />
                            </span>

                            </button>
                        </div>
                        <ThemeSwitch/>
                    </div>
                </div>
                <div>

                </div>
            </div>

        </ThemeProvider>

    )
}