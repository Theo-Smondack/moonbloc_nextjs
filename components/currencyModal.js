import React, {useEffect, useRef, useState} from "react";
import styles from "./currencyModal.module.css";
import {useCurrencyContext} from "../context/currency";
import CurrenciesObject from "../utils/currencies";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "./ThemeSwitch";

export default function CurrencyModal(props) {
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
    }, [])

    const refOne = useRef(null);

    const [isShow, setShow] = useState(false);

    const handleClickOutside = (e) => {
        if (refOne.current) {
            if (!refOne.current.contains(e.target)) {
                setShow(false)
            }
        }
    }

    const value = useCurrencyContext();
    const {currencySelected} = value.state;
    const _symbol = value.state.currency.symbol;
    const Currencies = CurrenciesObject;

    const changeCurrency = (currency) => {
        value.setCurrencySelected(currency);
        // props.onSelect(false)
        setShow(false);
    }

    return (
        <div style={{position: props.pos}}>
            <button title="Choose currency" onClick={() => setShow(!isShow)}>
                <span>{_symbol}</span>
                <span>{currencySelected}</span>
                <span>
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{fontSize: 12, color: ThemeSwitch.color}}
                    />
                </span>
            </button>
            {
                isShow ? (<div ref={refOne} className={styles.currencyModal}>
                    <div className={styles.modalContainer}>
                        {
                            Object.values(Currencies).map((key, index) => {
                                let _className = styles.divModal
                                let _txtGrey = "txtGrey"
                                if (key.value === currencySelected) {
                                    _className = `${styles.divModal} ${styles.selected}`
                                    _txtGrey = styles.txtGreySelected
                                }
                                return (
                                    <div key={index} className={_className}
                                         onClick={() => changeCurrency(key.value)}>
                                        <div>
                                            <span>{key.name}</span>
                                            <span className={_txtGrey}>{key.value} - {key.symbol}</span>
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