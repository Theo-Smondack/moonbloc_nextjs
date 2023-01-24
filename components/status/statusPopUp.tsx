import styles from './statusPopUp.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useStatusContext} from "../../context/status";

const StatusPopUp = () => {
    const {statusState} = useStatusContext()
    return (
        <div className={`popUpContainer ${statusState.success ? styles.successPopUp : styles.errorPopUp}`}>
            <FontAwesomeIcon
                icon={statusState.success ? faCircleCheck : faCircleExclamation}
                className={`${styles.popIcon} ${statusState.success ? styles.successPopIcon : styles.errorPopIcon}`}/>
            {statusState.message}
        </div>
    )
}
export default StatusPopUp