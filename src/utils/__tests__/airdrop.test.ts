import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

import { splitAirdropAmounts } from '@/utils/airdrop'

export const MAX_UINT128 = BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

describe('splitAirdropAmounts', () => {
  it('should always claim max uint128 if max is selected', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: true,
      amount: '1000',
      sep5AirdropClaimable: parseEther('2000').toString(),
      userAirdropClaimable: parseEther('1000').toString(),
      investorClaimable: '0',
    })

    expect(sep5Amount).toEqual(MAX_UINT128.toString())
    expect(userAmount).toEqual(MAX_UINT128.toString())
    expect(investorAmount).toEqual(MAX_UINT128.toString())
    expect(ecosystemAmount).toEqual(MAX_UINT128.toString())
  })

  it('should only claim from SEP5 if claim <= SEP5', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1000',
        sep5AirdropClaimable: parseEther('1000').toString(),
        userAirdropClaimable: '0',
        investorClaimable: '0',
      })

      expect(sep5Amount).toEqual(parseEther('1000').toString())
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1001',
        sep5AirdropClaimable: parseEther('1000').toString(),
        userAirdropClaimable: parseEther('1').toString(),
        investorClaimable: '0',
      })

      expect(sep5Amount).toEqual(parseEther('1000').toString())
      expect(userAmount).toEqual(parseEther('1').toString())
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual('0')
    }
  })

  it('should only claim from user if SEP5 is 0 and claim <= user', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1000',
        sep5AirdropClaimable: '0',
        userAirdropClaimable: parseEther('1000').toString(),
        investorClaimable: '0',
      })

      expect(sep5Amount).toEqual('0')
      expect(userAmount).toEqual(parseEther('1000').toString())
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1001',
        sep5AirdropClaimable: '0',
        userAirdropClaimable: parseEther('1000').toString(),
        investorClaimable: parseEther('1').toString(),
      })

      expect(sep5Amount).toEqual('0')
      expect(userAmount).toEqual(parseEther('1000').toString())
      expect(investorAmount).toEqual(parseEther('1').toString())
      expect(ecosystemAmount).toEqual('0')
    }
  })

  it('should only claim from investor if SEP5/user are 0 and claim <= investor', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1000',
        sep5AirdropClaimable: '0',
        userAirdropClaimable: '0',
        investorClaimable: parseEther('1000').toString(),
      })

      expect(sep5Amount).toEqual('0')
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual(parseEther('1000').toString())
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1001',
        sep5AirdropClaimable: '0',
        userAirdropClaimable: '0',
        investorClaimable: parseEther('1000').toString(),
      })

      expect(sep5Amount).toEqual('0')
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual(parseEther('1000').toString())
      expect(ecosystemAmount).toEqual(parseEther('1').toString())
    }
  })

  it('should only claim from ecosystem if SEP5/user/investor are 0 and claim <= ecosystem', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '1000',
      sep5AirdropClaimable: '0',
      userAirdropClaimable: '0',
      investorClaimable: '0',
    })

    expect(sep5Amount).toEqual('0')
    expect(userAmount).toEqual('0')
    expect(investorAmount).toEqual('0')
    expect(ecosystemAmount).toEqual(parseEther('1000').toString())
  })

  it('should only claim from SEP5/user if claim <= SEP5 + user', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1000',
        sep5AirdropClaimable: parseEther('500').toString(),
        userAirdropClaimable: parseEther('500').toString(),
        investorClaimable: '0',
      })

      expect(sep5Amount).toEqual(parseEther('500').toString())
      expect(userAmount).toEqual(parseEther('500').toString())
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1001',
        sep5AirdropClaimable: parseEther('500').toString(),
        userAirdropClaimable: parseEther('500').toString(),
        investorClaimable: parseEther('1').toString(),
      })

      expect(sep5Amount).toEqual(parseEther('500').toString())
      expect(userAmount).toEqual(parseEther('500').toString())
      expect(investorAmount).toEqual(parseEther('1').toString())
      expect(ecosystemAmount).toEqual('0')
    }
  })

  it('should only claim from SEP5/investor if user is 0 and claim <= SEP5 + investor', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1000',
        sep5AirdropClaimable: parseEther('500').toString(),
        userAirdropClaimable: '0',
        investorClaimable: parseEther('500').toString(),
      })

      expect(sep5Amount).toEqual(parseEther('500').toString())
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual(parseEther('500').toString())
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1001',
        sep5AirdropClaimable: parseEther('500').toString(),
        userAirdropClaimable: '0',
        investorClaimable: parseEther('500').toString(),
      })

      expect(sep5Amount).toEqual(parseEther('500').toString())
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual(parseEther('500').toString())
      expect(ecosystemAmount).toEqual(parseEther('1').toString())
    }
  })

  it('should only claim from SEP5/ecosystem is user/investor are 0 and claim > SEP5', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '1000',
      sep5AirdropClaimable: parseEther('500').toString(),
      userAirdropClaimable: '0',
      investorClaimable: '0',
    })

    expect(sep5Amount).toEqual(parseEther('500').toString())
    expect(userAmount).toEqual('0')
    expect(investorAmount).toEqual('0')
    expect(ecosystemAmount).toEqual(parseEther('500').toString())
  })

  it('should only claim from user/investor if SEP5 is 0 and claim <= user + investor', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1000',
        sep5AirdropClaimable: '0',
        userAirdropClaimable: parseEther('500').toString(),
        investorClaimable: parseEther('500').toString(),
      })

      expect(sep5Amount).toEqual('0')
      expect(userAmount).toEqual(parseEther('500').toString())
      expect(investorAmount).toEqual(parseEther('500').toString())
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '1001',
        sep5AirdropClaimable: '0',
        userAirdropClaimable: parseEther('500').toString(),
        investorClaimable: parseEther('500').toString(),
      })

      expect(sep5Amount).toEqual('0')
      expect(userAmount).toEqual(parseEther('500').toString())
      expect(investorAmount).toEqual(parseEther('500').toString())
      expect(ecosystemAmount).toEqual(parseEther('1').toString())
    }
  })

  it('should only claim from user/ecosystem if SEP5/investor are 0 and claim > user', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '1000',
      sep5AirdropClaimable: '0',
      userAirdropClaimable: parseEther('500').toString(),
      investorClaimable: '0',
    })

    expect(sep5Amount).toEqual('0')
    expect(userAmount).toEqual(parseEther('500').toString())
    expect(investorAmount).toEqual('0')
    expect(ecosystemAmount).toEqual(parseEther('500').toString())
  })

  it('should only claim from investor/ecosystem if SEP5/user are 0 and claim > investor', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '1000',
      sep5AirdropClaimable: '0',
      userAirdropClaimable: '0',
      investorClaimable: parseEther('500').toString(),
    })

    expect(sep5Amount).toEqual('0')
    expect(userAmount).toEqual('0')
    expect(investorAmount).toEqual(parseEther('500').toString())
    expect(ecosystemAmount).toEqual(parseEther('500').toString())
  })

  it('should only claim from SEP5/user/investor if claim <= SEP5 + user + investor', () => {
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '900',
        sep5AirdropClaimable: parseEther('300').toString(),
        userAirdropClaimable: parseEther('300').toString(),
        investorClaimable: parseEther('300').toString(),
      })

      expect(sep5Amount).toEqual(parseEther('300').toString())
      expect(userAmount).toEqual(parseEther('300').toString())
      expect(investorAmount).toEqual(parseEther('300').toString())
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
        isMax: false,
        amount: '901',
        sep5AirdropClaimable: parseEther('300').toString(),
        userAirdropClaimable: parseEther('300').toString(),
        investorClaimable: parseEther('300').toString(),
      })

      expect(sep5Amount).toEqual(parseEther('300').toString())
      expect(userAmount).toEqual(parseEther('300').toString())
      expect(investorAmount).toEqual(parseEther('300').toString())
      expect(ecosystemAmount).toEqual(parseEther('1').toString())
    }
  })

  it('should only claim from SEP5/user/ecosystem if investor is 0 and claim > SEP5 + user', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '900',
      sep5AirdropClaimable: parseEther('300').toString(),
      userAirdropClaimable: parseEther('300').toString(),
      investorClaimable: '0',
    })

    expect(sep5Amount).toEqual(parseEther('300').toString())
    expect(userAmount).toEqual(parseEther('300').toString())
    expect(investorAmount).toEqual('0')
    expect(ecosystemAmount).toEqual(parseEther('300').toString())
  })

  it('should only claim from SEP5/investor/ecosystem if user is 0 and claim > SEP5 + investor', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '900',
      sep5AirdropClaimable: parseEther('300').toString(),
      userAirdropClaimable: '0',
      investorClaimable: parseEther('300').toString(),
    })

    expect(sep5Amount).toEqual(parseEther('300').toString())
    expect(userAmount).toEqual('0')
    expect(investorAmount).toEqual(parseEther('300').toString())
    expect(ecosystemAmount).toEqual(parseEther('300').toString())
  })

  it('should only claim from user/investor/ecosystem if SEP5 is 0 and claim > user + investor', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '900',
      sep5AirdropClaimable: '0',
      userAirdropClaimable: parseEther('300').toString(),
      investorClaimable: parseEther('300').toString(),
    })

    expect(sep5Amount).toEqual('0')
    expect(userAmount).toEqual(parseEther('300').toString())
    expect(investorAmount).toEqual(parseEther('300').toString())
    expect(ecosystemAmount).toEqual(parseEther('300').toString())
  })

  it('should only claim from SEP5/user/investor/ecosystem if claim > SEP5 + user + investor', () => {
    const [sep5Amount, userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts({
      isMax: false,
      amount: '1200',
      sep5AirdropClaimable: parseEther('300').toString(),
      userAirdropClaimable: parseEther('300').toString(),
      investorClaimable: parseEther('300').toString(),
    })

    expect(sep5Amount).toEqual(parseEther('300').toString())
    expect(userAmount).toEqual(parseEther('300').toString())
    expect(investorAmount).toEqual(parseEther('300').toString())
    expect(ecosystemAmount).toEqual(parseEther('300').toString())
  })
})
