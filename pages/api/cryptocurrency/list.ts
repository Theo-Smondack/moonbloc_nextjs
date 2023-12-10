import { NextApiRequest, NextApiResponse } from 'next'

// Types import
import { CryptoDataCG } from '../../../types/cryptoData'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query
  const { page, convert, ids } = query
  // Define URL
  const url = new URL(`https://api.coingecko.com/api/v3/coins/markets`)

  if (typeof page !== 'string') {
    return res.status(400).json({ message: 'Page must be a string' })
  }

  //Define query parameters
  const params: { [index: string]: unknown } = {
    page: parseInt(page),
    per_page: '100',
    order: 'market_cap_desc',
    vs_currency: `${convert}`,
    sparkline: 'false',
    price_change_percentage: '1h,24h,7d',
  }
  ids ? (params.ids = ids) : null
  // Query parameters append to URL
  for (const i in params) {
    url.searchParams.append(i, params[i] as string)
  }
  // Fetch data from external API
  await fetch(url, {})
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Something wrong from api call')
    })
    .then((data) => {
      const jsonData = data.map((item: CryptoDataCG) => {
        return {
          id: item.id,
          market_cap_rank: item.market_cap_rank,
          market_cap: item.market_cap,
          percent_change_1h: item.price_change_percentage_1h_in_currency ?? 0,
          percent_change_24h: item.price_change_percentage_24h_in_currency ?? 0,
          percent_change_7d: item.price_change_percentage_7d_in_currency ?? 0,
          volume_24h: item.total_volume,
          price: item.current_price,
          image: item.image,
          name: item.name,
          symbol: item.symbol.toUpperCase(),
          total_supply: item.total_supply ?? 0,
        }
      })
      res.status(200).json(jsonData)
    })
    .catch((error) => {
      res.status(500)
      console.log(error)
    })
}
