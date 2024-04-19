import { Chains, CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { toRelativeLockHistory } from '../lock'

describe('toRelativeLockHistory', () => {
  it('should sort by execution timestamp', () => {
    const relativeHistory = toRelativeLockHistory(
      [
        {
          executionDate: '2024-04-03T14:49:24.000Z',
          transactionHash: '0xe3be658eb5ab72b0ed05f58c0987328dfeaa1b23b23111fb3325314dad83c9f6',
          holder: '0xC4934eA242Bf292CA59A2aF85ED116506F8f2d03',
          amount: '500000000000000000000000',
          logIndex: '88',
          unlockIndex: '0',
          eventType: 'UNLOCKED',
        },
        {
          executionDate: '2024-03-22T08:37:12.000Z',
          transactionHash: '0x2fde285a44b821d8482047cc516b71c0a510ae198553ce98c8973d5a5119f91b',
          holder: '0xC4934eA242Bf292CA59A2aF85ED116506F8f2d03',
          amount: '1000000000000000000000000',
          logIndex: '193',
          eventType: 'LOCKED',
        },
      ],
      CHAIN_START_TIMESTAMPS[Chains.SEPOLIA],
    )

    expect(relativeHistory).toHaveLength(2)
    expect(relativeHistory[0]).toEqual({
      day: 20,
      amount: 1000000,
    })
    expect(relativeHistory[1]).toEqual({
      day: 33,
      amount: -500000,
    })
  })
})
