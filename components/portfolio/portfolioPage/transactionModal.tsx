import styles from './transactionModal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { TransactionModalProps } from '../../../types/props'
import { TransactionInput } from '../../../models/Transaction'
import { useCurrencyContext } from '../../../context/currency'
import Image from 'next/image'
import AssetSelectorModal, { searchValue } from './assetSelectorModal'
import { useRouter } from 'next/router'

type TransactionState = {
  type: TransactionInput['type']
  from: {
    fromValue: string
    fromAsset: TransactionInput['from']
    fromImage: string
  }
  to: {
    toValue: string
    toAsset: TransactionInput['to']
    toImage: string
  }
  quantity: string
  price: string
  initalPrice: string
  fee: string
  date: TransactionInput['date']
}

const TransactionModal = ({
  showCallback,
  Asset,
  setAsset,
}: TransactionModalProps) => {
  const {
    query: { id },
  } = useRouter()
  const {
    state: { currency },
  } = useCurrencyContext()
  const [showFromSelector, setShowFromSelector] = useState<boolean>(false)
  const [transaction, setTransaction] = useState<TransactionState>({
    type: 'buy',
    from: {
      fromValue: currency?.value as string,
      fromAsset: currency?.value as string,
      fromImage: currency?.image as string,
    },
    to: {
      toValue: Asset.symbol.toUpperCase(),
      toAsset: Asset.id,
      toImage: Asset.image,
    },
    quantity: '1',
    initalPrice: Asset.price.toString(),
    price: Asset.price.toString(),
    fee: '0',
    date: new Date(),
  })
  const [previousType, setPreviousType] =
    useState<TransactionInput['type']>('buy')
  const {
    type,
    from: { fromValue, fromAsset, fromImage },
    to: { toValue, toImage, toAsset },
    date,
    price,
    quantity,
    fee,
    initalPrice,
  } = transaction

  const dateValue = date.toISOString().slice(0, 16)

  const getSwapTo = async () => {
    if (fromAsset === 'bitcoin') {
      await fetch(`/api/cryptocurrency/ethereum?convert=btc`)
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          throw new Error('Something wrong')
        })
        .then((responseJson) => {
          setTransaction({
            ...transaction,
            to: {
              toValue: responseJson.symbol.toUpperCase(),
              toAsset: responseJson.id,
              toImage: responseJson.logo,
            },
            price: responseJson.price.toString(),
            type: 'swap',
          })
        })
    } else {
      await fetch(`/api/cryptocurrency/${fromAsset}?convert=btc`).then(
        (res) => {
          res.json().then((data) => {
            setTransaction({
              ...transaction,
              to: {
                toValue: data.symbol.toUpperCase(),
                toAsset: data.id,
                toImage: data.logo,
              },
              price: data.price.toString(),
              type: 'swap',
            })
          })
        }
      )
    }
  }

  const handleTypeChange = async (type: TransactionState['type']) => {
    if (previousType === 'buy' || type === 'buy') {
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
        },
        type: type,
      })
    } else if (type === 'swap') {
      console.log('swap')
      await getSwapTo()
    } else if (previousType === 'swap') {
      if (type === 'sell') {
        setTransaction({
          ...transaction,
          to: {
            toValue: currency?.value as string,
            toAsset: currency?.value as string,
            toImage: currency?.image as string,
          },
          type: type,
        })
      } else if (type === 'buy') {
        setTransaction({
          ...transaction,
          from: {
            fromValue: currency?.value as string,
            fromAsset: currency?.value as string,
            fromImage: currency?.image as string,
          },
          to: {
            toValue: Asset.symbol.toUpperCase(),
            toAsset: Asset.id,
            toImage: Asset.image,
          },
          type: type,
        })
      }
    }
    setPreviousType(type)
  }

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target
    if (value === '') setTransaction({ ...transaction, [field]: '' })
    const regex = /^[0-9]+(\.[0-9]*)?$/
    if (regex.test(value)) {
      if (!isNaN(parseFloat(value))) {
        setTransaction({ ...transaction, [field]: value })
      }
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setTransaction({ ...transaction, date: new Date(value) })
  }

  const handleFromChange = (value: searchValue) => {
    const newPrice =
      (parseFloat(initalPrice) * parseFloat(quantity)) / value.price
    if (type === 'buy') {
      setTransaction({
        ...transaction,
        price: newPrice.toString(),
        from: {
          fromValue: value.symbol,
          fromAsset: value.id,
          fromImage: value.image,
        },
      })
    } else {
      setTransaction({
        ...transaction,
        price: newPrice.toString(),
        to: { toValue: value.symbol, toAsset: value.id, toImage: value.image },
      })
    }
  }

  const handleSubmit = async () => {
    try {
      await fetch(`/api/user/wallet/${id}/addTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: {
            type: type,
            from: fromAsset,
            to: toAsset,
            quantity: quantity,
            price: price,
            fee: fee,
            date: date,
          },
        }),
      }).then(() => {
        setAsset({
          ...Asset,
          quantity:
            type === 'buy'
              ? Asset.quantity + parseFloat(quantity)
              : Asset.quantity - parseFloat(quantity),
          total:
            type === 'buy'
              ? Asset.price * (Asset.quantity + parseFloat(quantity))
              : Asset.price * (Asset.quantity - parseFloat(quantity)),
        })
        showCallback(false)
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={styles.modalFog}>
      {showFromSelector && (
        <AssetSelectorModal
          title={'Choose asset'}
          showCallback={setShowFromSelector}
          addAsset={handleFromChange}
        />
      )}
      <div className={styles.modal}>
        <div className={styles.closeIconContainer}>
          <FontAwesomeIcon icon={faXmark} onClick={() => showCallback(false)} />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <h2>Add transaction</h2>
          </div>
          <div className={styles.modalForm}>
            <div className={styles.typeContainer}>
              <div
                className={`${styles.type} ${styles.leftType} ${
                  type === 'buy' ? styles.activeType : null
                }`}
                onClick={() =>
                  type !== 'buy' ? handleTypeChange('buy') : null
                }
              >
                Buy
              </div>
              <div
                className={`${styles.type} ${styles.middleType} ${
                  type === 'sell' ? styles.activeType : null
                }`}
                onClick={() =>
                  type !== 'sell' ? handleTypeChange('sell') : null
                }
              >
                Sell
              </div>
              <div
                className={`${styles.type} ${styles.rightType} ${
                  type === 'swap' ? styles.activeType : null
                }`}
                onClick={() =>
                  type !== 'swap' ? handleTypeChange('swap') : null
                }
              >
                Swap
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputLabel}>From</div>
              <div className={styles.inputSelectGroup}>
                <input
                  type={'text'}
                  className={styles.inputClass}
                  style={{ flex: 1 }}
                  placeholder={'Enter an amount...'}
                  value={type === 'buy' ? price : quantity}
                  onChange={
                    type === 'buy'
                      ? (e) => handleNumberInputChange(e, 'price')
                      : (e) => handleNumberInputChange(e, 'quantity')
                  }
                />
                {type === 'buy' ? (
                  <button
                    className={`${styles.inputClass} ${styles.selectorButton}`}
                    onClick={() => setShowFromSelector(true)}
                  >
                    {fromValue}
                    <Image
                      src={fromImage}
                      width={20}
                      height={20}
                      alt={'Asset logo'}
                    />
                    <FontAwesomeIcon icon={faAngleDown} />
                  </button>
                ) : (
                  <div className={styles.selectorButton}>
                    {fromValue}
                    <Image
                      src={fromImage}
                      width={20}
                      height={20}
                      alt={'Asset logo'}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputLabel}>To</div>
              <div className={styles.inputSelectGroup}>
                <input
                  type={'text'}
                  className={styles.inputClass}
                  style={{ flex: 1 }}
                  placeholder={'Enter an amount...'}
                  value={type === 'buy' ? quantity : price}
                  onChange={
                    type === 'buy'
                      ? (e) => handleNumberInputChange(e, 'quantity')
                      : (e) => handleNumberInputChange(e, 'price')
                  }
                />
                {type === 'buy' ? (
                  <div className={styles.selectorButton}>
                    {toValue}
                    <Image
                      src={toImage}
                      width={20}
                      height={20}
                      alt={'Asset logo'}
                    />
                  </div>
                ) : (
                  <button
                    className={`${styles.inputClass} ${styles.selectorButton}`}
                    onClick={() => setShowFromSelector(true)}
                  >
                    {toValue}
                    <Image
                      src={toImage}
                      width={20}
                      height={20}
                      alt={'Asset logo'}
                    />
                    <FontAwesomeIcon icon={faAngleDown} />
                  </button>
                )}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputLabel}>Fee</div>
              <input
                type={'text'}
                className={styles.inputClass}
                placeholder={'Enter fee...'}
                value={fee}
                onChange={(e) => handleNumberInputChange(e, 'fee')}
              />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputLabel}>Date</div>
              <input
                type={'datetime-local'}
                className={styles.inputClass}
                placeholder={'Enter date...'}
                value={dateValue}
                onChange={handleDateChange}
              />
            </div>

            <button
              type={'submit'}
              className={`${styles.formButton} bgBlueButton`}
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionModal
