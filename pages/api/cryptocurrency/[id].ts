import {NextApiRequest, NextApiResponse} from "next";
import {CryptoDataInfo} from "../../../types/cryptoData";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const { id } = req.query
    // Define URL
    const url = new URL(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info`)
    //Define query parameters
    const params:{[index:string]:string} = {
        'id': `${id}`,
    }
    // Query parameters append to URL
    for (let i in params) {
        url.searchParams.append(i, params[i])
    }
    // Fetch data from external API
    await fetch(url, {
        headers: {"X-CMC_PRO_API_KEY": process.env.CMC_API_KEY},
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        // console.log(data)
        throw new Error('Something wrong')
    }).then((responseJson) => {
        const jsonData : CryptoDataInfo = {
            id: responseJson.data[id as string].id,
            name: responseJson.data[id as string].name,
            symbol: responseJson.data[id as string].symbol,
            description: responseJson.data[id as string].description,
            logo: responseJson.data[id as string].logo,
            urls: {
                website: responseJson.data[id as string].urls.website,
                twitter: responseJson.data[id as string].urls.twitter,
                explorer: responseJson.data[id as string].urls.explorer,
                source_code: responseJson.data[id as string].urls.source_code,
                technical_doc: responseJson.data[id as string].urls.technical_doc,
                message_board: responseJson.data[id as string].urls.message_board,
            }
        }
        res.status(200).json(jsonData)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
}