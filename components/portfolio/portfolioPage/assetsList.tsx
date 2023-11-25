import styles from './assetsList.module.css'
import { AssetListProps } from '../../../types/props'
import { Asset } from '../../../types/wallet'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { useCurrencyContext } from '../../../context/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import TransactionModal from './transactionModal'

const AssetsList = ({ Assets }: AssetListProps) => {
  const {
    state: { currency },
  } = useCurrencyContext()
  const currencySymbol = currency?.symbol || '$'
  const [showModal, setShowModal] = useState<boolean>(false)
  const [asset, setAsset] = useState<Asset | null>(null)

  const handleShowModal = (asset: Asset) => {
    setShowModal(true)
    setAsset(asset)
  }

  const updatedAssets = useMemo(() => {
    if (asset && !showModal) {
      const index = Assets.findIndex((a: Asset) => a.id === asset.id)
      const newAssets = [...Assets]
      newAssets[index] = asset
      return newAssets
    }
    return Assets
  }, [Assets, asset, showModal])

  return (
    <div className={styles.container}>
      {showModal ? (
        <TransactionModal
          showCallback={setShowModal}
          Asset={asset as Asset}
          setAsset={setAsset}
        />
      ) : null}
      <table className={styles.assetsTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {updatedAssets.map((asset: Asset, index: number) => {
            return (
              <tr key={index}>
                <td>
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    width={24}
                    height={24}
                  />
                  <span>{asset.name}</span>
                  <span className={'txtGrey'}>
                    {asset.symbol.toUpperCase()}
                  </span>
                </td>
                <td>{`${asset.price.toFixed(2)} ${currencySymbol}`}</td>
                <td>{asset.quantity}</td>
                <td>{`${asset.total.toFixed(2)} ${currencySymbol}`}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className={styles.icon}
                    onClick={() => handleShowModal(asset)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default AssetsList
