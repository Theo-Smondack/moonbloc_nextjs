import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query
  const { currency, date } = query

  // Define URL
  const apiKEY = process.env.FREECURRENCY_API_KEY
  let url = new URL(`https://api.freecurrencyapi.com/v1/latest`)
  if (date) {
    url = new URL(`https://api.freecurrencyapi.com/v1/historical`)
  }

  //Define query parameters
  const params: { [index: string]: unknown } = {
    apikey: apiKEY,
    currencies: 'USD',
    date,
    base_currency: currency,
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
      const usdRate = date ? data.data[`${date}`][`USD`] : data.data[`USD`]
      res.status(200).json(usdRate)
    })
}
