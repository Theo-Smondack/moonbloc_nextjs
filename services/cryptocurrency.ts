import Cryptocurrency, {
  CryptocurrencyClass,
  CryptocurrencyDocument,
  CryptocurrencyInput,
} from '../models/Cryptocurrency'

export async function upsertCryptocurrency(
  input: CryptocurrencyInput
): Promise<CryptocurrencyDocument | undefined> {
  const crypto_currency = new CryptocurrencyClass(
    input.id,
    input.market_cap_rank,
    input.market_cap,
    input.percent_change_1h,
    input.percent_change_24h,
    input.percent_change_7d,
    input.volume_24h,
    input.price,
    input.image,
    input.name,
    input.symbol,
    input.total_supply,
    input.ohlcData,
    input.urls,
    input.description
  )
  const existingCrypto = await Cryptocurrency.findOne(
    { id: crypto_currency.id },
    'id',
    { lean: true }
  )
  if (existingCrypto) {
    console.log(existingCrypto)
  } else {
    return Cryptocurrency.create(crypto_currency)
  }
}
