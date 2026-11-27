import { floorNumber, formatAmount } from '@/utils/formatters'

describe('formatters', () => {
  describe('formatAmount', () => {
    it('should format to a fixed amount of decimals', () => {
      expect(formatAmount(0, 0)).toEqual('0')
      expect(formatAmount(0, 2)).toEqual('0.00')
      expect(formatAmount(0, 5)).toEqual('0.00000')

      expect(formatAmount(1.11111111111111, 0)).toEqual('1')
      expect(formatAmount(1.11111111111111, 2)).toEqual('1.11')
      expect(formatAmount(1.11111111111111, 5)).toEqual('1.11111')
    })

    it('should split at thousands', () => {
      expect(formatAmount(1_000, 0)).toEqual('1,000')
      expect(formatAmount(10_000, 0)).toEqual('10,000')
      expect(formatAmount(1_000_000, 0)).toEqual('1,000,000')
    })
  })

  describe('floorNumber', () => {
    it('should floor numbers without decimals', () => {
      expect(floorNumber(2.0, 2)).toEqual(2)
    })

    it('should floor numbers above .5 decimals', () => {
      expect(floorNumber(2.449, 1)).toEqual(2.4)
    })

    it('should floor numbers with .5 decimals', () => {
      expect(floorNumber(2.45, 1)).toEqual(2.4)
    })

    it('should floor numbers above .5 decimals', () => {
      expect(floorNumber(2.49, 1)).toEqual(2.4)
    })
  })
})
