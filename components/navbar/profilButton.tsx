import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";
import styles from './profilButton.module.css'
import ProfilPopup from "../profilPopup/profilPopup";
import React, {useRef, useState} from "react";
const ProfilButton = () => {
    const [show, setShow] = useState(false)
    const profilButtonRef = useRef<HTMLDivElement>(null)
    const popUpRef = useRef<HTMLDivElement>(null)
    let timer: NodeJS.Timeout;
    const handlePopUpMouseEnter = () => {
        // clear timer
        clearTimeout(timer);
    };
    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        // set timer and if mouse leave after 0.5s, hide the popup
        timer = setTimeout(() => {
            if (!profilButtonRef.current?.contains(event.relatedTarget as Node) &&
                !popUpRef.current?.contains(event.relatedTarget as Node)) {
                setShow(false)
            }
        }, 200);
    }

    return (
        <div className={styles.profilButtonContainer} ref={profilButtonRef} onMouseLeave={(event) => {handleMouseLeave(event)}}>
            <FontAwesomeIcon icon={faUserCircle} style={{fontSize:30}} className={styles.profilPicture}
                             onMouseEnter={() => setShow(true)}
            />
            {show && <ProfilPopup refProp={popUpRef} onMouseEnter={handlePopUpMouseEnter}/>}
        </div>
    )
}

export default ProfilButton

