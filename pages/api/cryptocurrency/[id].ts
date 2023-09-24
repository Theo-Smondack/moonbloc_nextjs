import { NextApiRequest, NextApiResponse } from 'next';
import { CryptoDataInfo } from '../../../types/cryptoData';


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const { id,convert } = req.query
    // Define URL
    const url = new URL(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
    // Fetch data from external API
    await fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        }
        // console.log(data)
        throw new Error('Something wrong')
    }).then((responseJson) => {
        const jsonData : CryptoDataInfo = {
            id: responseJson.id,
            name: responseJson.name,
            price: responseJson.market_data.current_price[`${convert}`],
            price_change_percentage_24h: responseJson.market_data.price_change_percentage_24h,
            symbol: responseJson.symbol.toUpperCase(),
            description: responseJson.description.en,
            logo: responseJson.image.large,
            urls: {
                website: responseJson.links.homepage,
                explorer: responseJson.links.blockchain_site,
                source_code: responseJson.links.repos_url.github,
                message_board: responseJson.links.chat_url,
            },
        }
        res.status(200).json(jsonData)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
}