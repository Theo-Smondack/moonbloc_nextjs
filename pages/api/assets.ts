import {NextApiRequest, NextApiResponse} from "next";
import {Asset, AssetList} from "../../types/asset";
import currencies from "../../utils/currencies";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).json({ok: false, error: "Method not allowed"});
        return;
    }
    const {query} = req;
    if (!query) {
        res.status(400).json({ok: false, error: "Invalid credentials"});
        return;
    }
    const {vs_currency, filter} = query;
    if (!vs_currency) {
        res.status(400).json({ok: false, error: "Invalid credentials"});
        return;
    }
    if (!filter) {
        const result = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false`);
        if (result.status !== 200) {
            res.status(result.status).json({ok: false, error: result.statusText});
            return;
        }
        let _data:AssetList = currencies.map((currency) => {
            return {
                id: currency.value,
                symbol: currency.symbol,
                image: currency.image,
            }
        });
        await result.json().then((data: Asset[]) => {
            _data = _data.concat(data.map((coin: Asset) => {return {id: coin.id, symbol: coin.symbol, image: coin.image}}));
        });
        res.status(200).json({
            ok: true,
            data: _data
        });
        return;
    }
    res.status(200).json({ok: true, data: "Hello world"});
    return;

}