import {NextApiRequest, NextApiResponse} from "next";

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
    const getStart = (page: string | string[]): string => {
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
        res.status(200).json(data.data)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
}