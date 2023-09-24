import axios from 'axios'

const coinGeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 1000,
})

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 1000,
})

export { coinGeckoApi, api }
