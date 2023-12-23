import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, currency, id } = req.query
  if (!id) {
    res.status(400).json({
      message: 'Missing query parameters',
    })
  }

  // Define URL
  let url = new URL(`https://api.coingecko.com/api/v3/simple/price`)

  if (date) {
    url = new URL(`https://api.coingecko.com/api/v3/coins/${id}/history`)
  }

  //Define query parameters
  const params: { [index: string]: unknown } = {
    ids: !date ? id : undefined,
    vs_currencies: currency
      ? currency?.toString().toLowerCase()
      : !date
      ? 'usd'
      : undefined,
    date,
  }
  // Query parameters append to URL
  for (const i in params) {
    url.searchParams.append(i, params[i] as string)
  }

  await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Something wrong from api call')
    })
    .then((data) => {
      console.log(currency)
      console.log(data)
      const cryptoPrice = date
        ? data.market_data.current_price[
            `${currency ? currency.toString().toLowerCase() : 'usd'}`
          ]
        : data[`${id}`][
            `${currency ? currency.toString().toLowerCase() : 'usd'}`
          ]
      res.status(200).json(cryptoPrice)
    })
}
