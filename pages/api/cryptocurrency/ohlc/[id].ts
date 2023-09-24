import { NextApiRequest, NextApiResponse } from 'next'
import { replaceDuplicatesWithEmptyStrings } from '../../../../helpers/toolFunctions';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const { id,days,currency } = req.query
    // Define URL
    const url = new URL(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`)

    // Fetch data from external API
    await fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something wrong')
    }).then((responseJson) => {
        let labels,oneDayLabels;
        if (days === '1') {
            labels = responseJson.map((element:any) => {
                return new Date(element[0]).toTimeString().slice(0, 5);
            });
            oneDayLabels = responseJson.map((element:any) => {
                // return dates as string only date and month
                return new Date(element[0]).toDateString().slice(0, 10);
            });
        }else{
            labels = responseJson.map((element:any) => {
                // return dates as string only date and month
                return new Date(element[0]).toDateString().slice(0, 10);
            });
        }


        const parsedLabels = replaceDuplicatesWithEmptyStrings(labels);
        //map OHLC_bitcoin to get the close price
        const cryptoOHLC = responseJson.map((element:any) => {
            return element[4] ;
        });
        const jsonData = {
            labels: oneDayLabels ? oneDayLabels : labels,
            parsedLabels: parsedLabels,
            cryptoOHLC: cryptoOHLC,
        }

        res.status(200).json(jsonData)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
}