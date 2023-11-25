import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

// Helpers imports
import DbConnection from '../../../../../helpers/dbConnection'

// Models imports
import Wallet from '../../../../../models/Wallet'

// Types imports
import { AssetList, CGAsset, WalletResponse } from '../../../../../types/wallet'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await DbConnection.getInstance()
  if (req.method !== 'GET') {
    res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
    return
  }

  const { id, currency } = req.query
  try {
    //#region Fetching from mongoDB
    const _id = new mongoose.Types.ObjectId(id as string)
    const wallet = await Wallet.findOne({ _id: _id }, 'assets walletTitle')
    if (!wallet) {
      res.status(404).json({
        ok: false,
        error: 'Wallet not found',
      })
      return
    }
    //#endregion

    //#region Use WalletSchema methods
    let assets: AssetList = wallet.getAssets()
    const walletTitle = wallet.getWalletTitle()
    //#endregion

    //#region Update Wallet assets by using CoinGecko API
    if (assets && assets.length) {
      const assetsIds = assets.map((asset) => asset?.id).join(',')
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?ids=${assetsIds}&vs_currency=${currency}`
      )
      if (!response.ok) {
        const errorMessage = await response.text()
        res.status(400).json({ ok: false, error: errorMessage })
        return
      }

      const result = await response.json()
      // Update assets with new data
      const updatedAssets = assets.map((asset) => {
        const matchingData = result.find(
          (elem: CGAsset) => asset?.id === elem.id
        )

        if (matchingData) {
          // Update existing properties
          return {
            ...asset,
            total: matchingData.current_price * asset.quantity,
            image: matchingData.image,
            price: matchingData.current_price,
            symbol: matchingData.symbol,
            name: matchingData.name,
          }
        }

        return asset
      })

      updatedAssets.sort((a, b) => b.total - a.total)

      assets = updatedAssets
    }
    //#endregion

    const walletResponse: WalletResponse['wallet'] = {
      assets: assets ? assets : [],
      walletID: _id,
      walletTitle: walletTitle,
    }
    res.status(200).json({ ok: true, wallet: walletResponse })
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: (error as Error).message,
    })
    return
  }
}
