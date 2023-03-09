import styles from "./card.module.css";
import CardPopup from "./cardPopup";
import {CardProps} from "../../types/props";
import {useState} from "react";

const Card = ({title,id,index}: CardProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return (
        <div className={`${styles.card} ${isHovered ? styles.hoveredCard : null}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <CardPopup id={id} hoverCallback={setIsHovered} index={index}/>
            <div className={styles.cardTitleContainer}>
                <h2>{title}</h2>
            </div>
        </div>
    )
}

export default Card