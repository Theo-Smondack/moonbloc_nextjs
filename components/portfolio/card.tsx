import styles from "./card.module.css";
import CardPopup from "./cardPopup";
import {CardProps} from "../../types/props";
import {useState} from "react";
import Link from "next/link";

const Card = ({title, id, index}: CardProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return (
        <Link href={`/portfolio/${id}`} key={index}>
            <div className={`${styles.card} ${isHovered ? styles.hoveredCard : null}`}
                 onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <CardPopup id={id} hoverCallback={setIsHovered} index={index}/>
                <div className={styles.cardTitleContainer}>
                    <h2>{title}</h2>
                </div>
            </div>
        </Link>
    )
}

export default Card