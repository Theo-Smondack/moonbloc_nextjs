import { NextApiRequest, NextApiResponse } from 'next'
import { CryptocurrencyInput } from '../../../../models/Cryptocurrency'
import { upsertCryptocurrency } from '../../../../services/cryptocurrency'
import { getMarketValuesForCurrencies } from '../../../../helpers/currencies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  const url = new URL(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  )
  const options = {
    method: 'GET',
    headers: { 'x-cg-demo-api-key': 'CG-dNJpAjt8zwE5idpt8yuCjXX4' },
  }
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const json = await response.json()
    console.log(`Inserting data of ${id} into database...`)
    // Insert data into database
    const data: CryptocurrencyInput = {
      id: json.id,
      market_cap_rank: json.market_cap_rank,
      market_cap: getMarketValuesForCurrencies(json.market_data.market_cap),
      percent_change_1h: getMarketValuesForCurrencies(
        json.market_data.price_change_percentage_1h_in_currency
      ),
      percent_change_24h: getMarketValuesForCurrencies(
        json.market_data.price_change_percentage_24h_in_currency
      ),
      percent_change_7d: getMarketValuesForCurrencies(
        json.market_data.price_change_percentage_7d_in_currency
      ),
      volume_24h: getMarketValuesForCurrencies(json.market_data.total_volume),
      price: getMarketValuesForCurrencies(json.market_data.current_price),
      image: json.image.large,
      name: json.name,
      symbol: json.symbol,
      total_supply: json.market_data.total_supply,
      ohlcData: [],
      urls: {
        website: json.links.homepage[0],
        explorer: json.links.blockchain_site[0],
        source_code: json.links.repos_url.github[0],
        message_board: json.links.chat_url,
      },
      description: json.description.en,
    }
    const upsertedCrypto = await upsertCryptocurrency(data)
    if (upsertedCrypto) {
      res
        .status(200)
        .send(`Cryptocurrency data of ${data.id} upsert successfully!`)
    } else {
      res.status(500).send('Cryptocurrency data upsert failed!')
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error })
  }
}
