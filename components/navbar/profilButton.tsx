import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";
import styles from './profilButton.module.css'
import ProfilPopup from "../profilPopup/profilPopup";
import React, {useRef, useState} from "react";
const ProfilButton = () => {
    const [show, setShow] = useState(false)
    const profilButtonRef = useRef<HTMLDivElement>(null)
    const popUpRef = useRef<HTMLDivElement>(null)
    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!profilButtonRef.current || !popUpRef.current) {
            return;
        }
        // if (!profilButtonRef.current.contains(event.relatedTarget as Node) &&
        //     !popUpRef.current.contains(event.relatedTarget as Node)) {
        //     // setShow(false)
        //     console.log("Mouse leave")
        // }
    }

    return (
        <div className={styles.profilButtonContainer} ref={profilButtonRef} onMouseLeave={(event) => {handleMouseLeave(event)}}>
            <FontAwesomeIcon icon={faUserCircle} style={{fontSize:30}} className={styles.profilPicture}
                             onMouseEnter={() => setShow(true)}
            />
            {show && <ProfilPopup refProp={popUpRef}/>}
        </div>
    )
}

export default ProfilButton

