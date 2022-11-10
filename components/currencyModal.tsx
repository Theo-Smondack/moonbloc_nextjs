import React, {useEffect, useRef, useState} from "react";
import styles from "./currencyModal.module.css";
import {useCurrencyContext} from "../context/currency";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {Currency} from "../types/currency";
import Currencies from "../utils/currencies";
import {CurrencyModalProps} from "../types/props";

const CurrencyModal = (props:CurrencyModalProps) => {
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
    }, [])

    const refOne = useRef<HTMLDivElement>(null);
    const [isShow, setShow] = useState(false);

    const handleClickOutside = (e:MouseEvent) => {
        if (refOne.current) {
            if (!refOne.current?.contains(e.target as Node)) {
                setShow(false)
            }
        }
    }

    const value = useCurrencyContext();
    const currencySelected : Currency | undefined = value.state.currency
    const _symbol : string | undefined = currencySelected?.symbol
    const changeCurrency = (currency : Currency) => {
        value.setCurrency(currency);
        setShow(false);
    }

    return (
        <div style={{position: props.pos}}>
            <button title="Choose currency" onClick={() => setShow(!isShow)}>
                <span>{_symbol}</span>
                <span>{currencySelected?.value}</span>
                <span>
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{fontSize: 12}}
                    />
                </span>
            </button>
            {
                isShow ? (<div ref={refOne} className={styles.currencyModal}>
                    <div className={styles.modalContainer}>
                        {
                            Currencies.map((currency:Currency, index:number) => {
                                let _className = styles.divModal
                                let _txtGrey = "txtGrey"
                                if (currency === currencySelected) {
                                    _className = `${styles.divModal} ${styles.selected}`
                                    _txtGrey = styles.txtGreySelected
                                }
                                return (
                                    <div key={index} className={_className}
                                         onClick={() => changeCurrency(currency)}>
                                        <div>
                                            <span>{currency.name}</span>
                                            <span className={_txtGrey}>{currency.value} - {currency.symbol}</span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                    </div>
                </div>) : null
            }
        </div>
    )
}
export default CurrencyModal;