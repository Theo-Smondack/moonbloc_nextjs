import React, { useEffect, useRef, useState } from 'react';
import styles from './currencyModal.module.css';
import { useCurrencyContext } from '../../context/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Currency } from '../../types/currency';
import Currencies from '../../helpers/currencies';
import { CurrencyModalProps } from '../../types/props';
import Image from 'next/image';

const CurrencyModal:React.FC<CurrencyModalProps> = (props) => {
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
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
    const changeCurrency = (currency : Currency) => {
        value.setCurrency(currency);
        setShow(false);
    }

    return (
        <div style={{ position: props.pos,display:'flex',justifyContent:'center' }}>
            <button className={styles.chooseCurrencyButton} title="Choose currency" onClick={() => setShow(!isShow)}>
                <span><Image src={currencySelected?.image as string} alt={'Currency logo'} width={20} height={20}/></span>
                <span>{currencySelected?.value}</span>
                <span style={{ marginLeft:3 }}>
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        style={{ fontSize: 12 }}
                    />
                </span>
            </button>
            {
                isShow ? (<div ref={refOne} className={styles.currencyModal}>
                    <div className={styles.modalContainer}>
                        {
                            Currencies.map((currency:Currency, index:number) => {
                                let _className = styles.divModal
                                let _txtGrey : string = 'txtGrey'
                                let spanClassName : string | undefined;
                                if (currency === currencySelected) {
                                    _className = `${styles.divModal} ${styles.selected}`
                                    _txtGrey = styles.txtGreySelected
                                    spanClassName = styles.txtWhiteSelected
                                }
                                return (
                                    <div key={index} className={_className}
                                         onClick={() => changeCurrency(currency)}>
                                        <div>
                                            <span className={spanClassName}>{currency.name}</span>
                                            <span className={`${_txtGrey} ${styles.symbolImage}`}>{currency.value} - <Image src={currency.image} alt={'Currency logo'} width={20} height={20}/></span>
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