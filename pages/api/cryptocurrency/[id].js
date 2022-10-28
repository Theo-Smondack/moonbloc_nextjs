export default async function handler(req, res) {
    const { id } = req.query
    // Define URL
    const url = new URL(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info`)
    //Define query parameters
    const params = {
        'id': `${id}`,
    }
    // Query parameters append to URL
    for (let i in params) {
        url.searchParams.append(i, params[i])
    }
    // Fetch data from external API
    const data = await fetch(url, {
        headers: {"X-CMC_PRO_API_KEY": process.env.CMC_API_KEY},
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        console.log(data)
        throw new Error('Something wrong')
    }).then((responseJson) => {
        res.status(200).json(responseJson.data)
    }).catch((error) => {
        res.status(500)
        console.log(error)
    })
}