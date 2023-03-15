import styles from "./transactionModal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {TransactionModalProps} from "../../../types/props";
import UpAndDownArrows from "../../UpAndDownArrows/upAndDownArrows";
import {TransactionDocument} from "../../../models/Transaction";

const TransactionModal = ({showCallback}: TransactionModalProps) => {
    const [type, setType] = useState<TransactionDocument['type']>('buy')
    return (
        <div className={styles.modalFog}>
            <div className={styles.modal}>
                <div className={styles.closeIconContainer}>
                    <FontAwesomeIcon icon={faXmark} onClick={() => showCallback(false)}/>
                </div>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        <h2>Add transaction</h2>
                    </div>
                    <div className={styles.modalForm}>
                        <div className={styles.typeContainer}>
                            <div className={`${styles.type} ${styles.leftType} ${type === 'buy' ? styles.activeType : null}`} onClick={() => setType('buy')}>Buy</div>
                            <div className={`${styles.type} ${styles.rightType} ${type === 'sell' ? styles.activeType : null}`} onClick={() => setType('sell')}>Sell</div>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>From</div>
                            <div className={styles.inputSelectGroup}>
                                <input type={"text"} className={styles.inputClass} style={{flex: 1}}
                                       placeholder={'Enter an amount...'}/>
                                <select className={styles.inputClass}>
                                    <option value={"USD"}>USD 🇺🇸</option>
                                    <option value={"EUR"}>EUR 🇪🇺</option>
                                </select>
                            </div>
                        </div>
                        <UpAndDownArrows/>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>To</div>
                            <div className={styles.inputSelectGroup}>
                                <input type={"text"} className={styles.inputClass} style={{flex: 1}}
                                       placeholder={'Enter an amount...'}/>
                                <select className={styles.inputClass}>
                                    <option value={"USD"}>USD 🇺🇸</option>
                                    <option value={"EUR"}>EUR 🇪🇺</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Fee</div>
                            <input type={"text"} className={styles.inputClass} placeholder={'Enter fee...'}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Date</div>
                            <input type={"date"} className={styles.inputClass} placeholder={'Enter date...'}/>
                        </div>

                        <button type={"submit"} className={`${styles.formButton} bgBlueButton`}>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TransactionModal