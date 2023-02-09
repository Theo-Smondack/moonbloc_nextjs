import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import styles from './profilButton.module.css'
import ProfilPopup from "../profilPopup/profilPopup";
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {ProfilButtonProps} from "../../types/props";
const ProfilButton = ({setNavbar,isOpen}:ProfilButtonProps) => {
    const [show, setShow] = useState<boolean>(false)
    const [rotated, setRotated] = useState<boolean>(false)
    const {data} = useSession()
    const profilButtonRef = useRef<HTMLDivElement>(null)
    const popUpRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
            setShow(false)
            setRotated(false)

    }, [isOpen])

    let timer: NodeJS.Timeout;
    const handlePopUpMouseEnter = () => {
        // clear timer
        clearTimeout(timer);
    };
    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        // set timer and if mouse leave after 0.2s, hide the popup
        timer = setTimeout(() => {
            if (!profilButtonRef.current?.contains(event.relatedTarget as Node) &&
                !popUpRef.current?.contains(event.relatedTarget as Node)) {
                setShow(false)
            }
        }, 200);
    }

    const handleClick = () => {
        setRotated(!rotated)
        setShow(!show)
    }

    const closePopUpCallback = () => {
        handleClick()
        if (setNavbar) {
            setNavbar(false)
        }
    }

    return (
        <div>
            {/*Pop up in fullWidth screen*/}
            <div className={styles.profilButtonContainer} ref={profilButtonRef} onMouseLeave={(event) => {
                handleMouseLeave(event)
            }}>
                <FontAwesomeIcon icon={faUserCircle} style={{fontSize: 30}} className={styles.buttonIcon}
                                 onMouseEnter={() => setShow(true)}
                />
                {show && <ProfilPopup closePopUp={() => setShow(false)} refProp={popUpRef} keepOpenCb={handlePopUpMouseEnter}/>}
            </div>
            {/*Pop up in responsive screen*/}
            <div className={styles.respContainer}>
                <div className={styles.profilButtonRespContainer} onClick={handleClick}>
                    <FontAwesomeIcon icon={faUserCircle} style={{fontSize: 30}} className={styles.buttonIcon}/>
                    <div className={styles.userNameLabel}>{data?.user?.name}</div>
                    <FontAwesomeIcon icon={faAngleDown}
                                     style={{fontSize: 30, transform: rotated ? "rotate(180deg)" : "rotate(0deg)"}}
                                     className={`${styles.buttonIcon} ${styles.angleDown}`}/>
                </div>
                {show && <ProfilPopup closePopUp={closePopUpCallback} refProp={popUpRef} keepOpenCb={handlePopUpMouseEnter}/>}
            </div>
        </div>
    )
}

export default ProfilButton

