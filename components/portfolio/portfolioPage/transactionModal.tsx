import styles from "./transactionModal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {TransactionModalProps} from "../../../types/props";
import UpAndDownArrows from "../../UpAndDownArrows/upAndDownArrows";
import {TransactionInput} from "../../../models/Transaction";
import {useCurrencyContext} from "../../../context/currency";
import Image from "next/image";

type TransactionState = {
    type: TransactionInput['type'],
    from: {
        fromValue: string,
        fromAsset: TransactionInput['from'],
        fromImage: string,
    },
    to: {
        toValue: string,
        toAsset: TransactionInput['to'],
        toImage: string,
    },
    quantity: TransactionInput['quantity'],
    price: TransactionInput['price'],
    fee: TransactionInput['fee'],
    date: TransactionInput['date'],

}

const TransactionModal = ({showCallback}: TransactionModalProps) => {
    const {state: {currency}} = useCurrencyContext()
    const [transaction, setTransaction] = useState<TransactionState>({
        type: 'buy',
        from: {
            fromValue: currency?.value as string,
            fromAsset: currency?.value as string,
            fromImage: currency?.image as string,
        },
        to: {
            toValue: 'BTC',
            toAsset: 'bitcoin',
            toImage: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
        },
        quantity: 0,
        price: 0,
        fee: 0,
        date: new Date(),
    })
    const {type,from:{fromValue,fromAsset,fromImage},to:{toValue,toImage,toAsset},date,price,quantity,fee} = transaction

    const switchAssets = () => {
        setTransaction({
            ...transaction,
            from: {
                fromValue: toValue,
                fromAsset: toAsset,
                fromImage: toImage,
            },
            to: {
                toValue: fromValue,
                toAsset: fromAsset,
                toImage: fromImage,
            }
        })
    }

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
                            <div
                                className={`${styles.type} ${styles.leftType} ${type === 'buy' ? styles.activeType : null}`}
                                onClick={() => setTransaction({ ...transaction,type:"buy"})}>Buy
                            </div>
                            <div
                                className={`${styles.type} ${styles.rightType} ${type === 'sell' ? styles.activeType : null}`}
                                onClick={() => setTransaction({ ...transaction,type:"sell"})}>Sell
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>From</div>
                            <div className={styles.inputSelectGroup}>
                                <input type={"text"} className={styles.inputClass} style={{flex: 1}}
                                       placeholder={'Enter an amount...'}/>
                                <button className={`${styles.inputClass} ${styles.selectorButton}`}
                                        onClick={() => console.log()}>{fromValue}
                                    <Image src={fromImage} width={20} height={20} alt={"Asset logo"}/>
                                    <FontAwesomeIcon icon={faAngleDown}/>
                                </button>
                            </div>
                        </div>
                        <UpAndDownArrows onClick={switchAssets}/>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>To</div>
                            <div className={styles.inputSelectGroup}>
                                <input type={"text"} className={styles.inputClass} style={{flex: 1}}
                                       placeholder={'Enter an amount...'}/>
                                <button className={`${styles.inputClass} ${styles.selectorButton}`}
                                        onClick={() => console.log('Open selector')}>{toValue}
                                    <Image src={toImage} width={20} height={20} alt={"Asset logo"}/>
                                    <FontAwesomeIcon icon={faAngleDown}/>
                                </button>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Fee</div>
                            <input type={"text"} className={styles.inputClass} placeholder={'Enter fee...'}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputLabel}>Date</div>
                            <input type={"date"} className={styles.inputClass} placeholder={'Enter date...'} value={date.toISOString().substring(0,10)} onChange={()=>console.log('Changed')}/>
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