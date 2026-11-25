export const formatAmount = (amount: number | string, decimals: number) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  const value = typeof amount === 'string' ? Number(amount) : amount

  return formatter.format(value)
}

export const floorNumber = (num: number, digits: number) => {
  const decimal = Math.pow(10, digits)
  return Math.floor(num * decimal) / decimal
}
