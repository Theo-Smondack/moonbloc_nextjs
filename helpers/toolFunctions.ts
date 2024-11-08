import { StatusState } from '../types/status'
import { ModalState, ModalType } from '../types/usersAuthentication'

export function isNegative(num: number | string): boolean {
  return typeof num === 'number' && num < 0
}

export function isEmail(email: string): boolean {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return expression.test(email)
}

export function isEmptyFields(fields: string[]): boolean {
  const res = fields.map((field) => Boolean(field && field.trim()))
  return res.includes(false)
}

export function showAuthModal(
  callback: ({ show, type }: ModalState) => void,
  show: boolean,
  type: ModalType | undefined
): void {
  callback({ show, type })
  show
    ? (document.body.style.overflow = 'hidden')
    : (document.body.style.overflow = 'auto')
}

export async function handleStatus(
  callback: ({ success, message }: StatusState) => void,
  success: boolean,
  message: string
) {
  await callback({ success, message })
  const popup = document.querySelector('.popUpContainer') as HTMLElement
  popup.style.transform = 'translate(-50%) scaleY(1)'
  setTimeout(() => {
    popup.style.transform = 'translate(-50%) scaleY(0)'
  }, 3000)
}

export function replaceDuplicatesWithEmptyStrings(arr: string[]): string[] {
  const uniqueValues = new Set<string>()
  const result: string[] = []

  for (const value of arr) {
    if (uniqueValues.has(value)) {
      result.push('')
    } else {
      uniqueValues.add(value)
      result.push(value)
    }
  }

  return result
}
export function findMinMax(numbers: number[]): { min: number; max: number } {
  if (numbers.length === 0) {
    throw new Error('Array cannot be empty')
  }

  let min = numbers[0]
  let max = numbers[0]

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i]
    }
    if (numbers[i] > max) {
      max = numbers[i]
    }
  }

  return { min, max }
}
export const getDataFromApi = async (url: RequestInfo | URL) => {
  const res = await fetch(url, { method: 'GET' })
  return res.json()
}

export const isToday = (dateString: string): boolean => {
  // Convert the input string to a Date object
  const inputDate = new Date(dateString)

  // Get today's date
  const today = new Date()

  // Compare year, month, and day (ignoring hours, minutes, and seconds)
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  )
}

//#region Date formatting
// Format date for use in the FreeCurrencyAPI
export const FCADateFormat = (inputDateString: string): string => {
  const inputDate = new Date(inputDateString)

  // Extract year, month, and day components
  const year = inputDate.getFullYear()
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
  const day = inputDate.getDate().toString().padStart(2, '0')

  // Construct the formatted date string
  return `${year}-${month}-${day}`
}

// Format date for use in the CoinGecko API
export const CGDateFormat = (inputDateString: string): string => {
  const inputDate = new Date(inputDateString)

  // Extract year, month, and day components
  const year = inputDate.getFullYear()
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
  const day = inputDate.getDate().toString().padStart(2, '0')

  // Construct the formatted date string
  return `${day}-${month}-${year}`
}
//#endregion
