import {NextApiRequest, NextApiResponse} from "next";
import {CryptoData} from "../../../../types/cryptoData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query
    const {page, convert} = query;
    // Define URL
    const url = new URL(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`)

    //Define header
    const _header: HeadersInit = {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
    }

    //Define start
    const getStart = (page: string | string[] | undefined): string => {
        let start: number = 1;
        if (page) {
            if (typeof page === "string") {
                start = (parseInt(page) * 100) - 99;
            }
        }
        return start.toString();
    }

    //Define query parameters
    const params: { [index: string]: any } = {
        'start': getStart(page),
        'limit': '100',
        'convert': `${convert}`
    }
    // Query parameters append to URL
    for (let i in params) {
        url.searchParams.append(i, params[i])
    }
    // Fetch data from external API
    await fetch(url, {
        headers: _header,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something wrong from api call')
    }).then((data) => {
        const jsonData = data.data.map((item: CryptoData) => {
            return {
                id: item.id,
                name: item.name,
                symbol: item.symbol,
                cmc_rank: item.cmc_rank,
                quote: {
                    [convert as string]: {
                        percent_change_1h: item.quote[convert as string].percent_change_1h,
                        percent_change_24h: item.quote[convert as string].percent_change_24h,
                        percent_change_7d: item.quote[convert as string].percent_change_7d,
                        market_cap: item.quote[convert as string].market_cap,
                        volume_24h: item.quote[convert as string].volume_24h,
                        price: item.quote[convert as string].price,
                    }
                },
                total_supply: item.total_supply === null ? 0 : item.total_supply
            }
        })
        res.status(200).json(jsonData)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
}