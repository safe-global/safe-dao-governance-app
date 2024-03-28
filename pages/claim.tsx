import type { NextPage } from 'next'

import SuccessfulClaim from '@/components/Claim/SuccessfulClaim'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppRoutes } from '@/config/routes'
import MediumPaper from '@/components/MediumPaper'

const ClaimPage: NextPage = () => {
  const router = useRouter()
  const query = useSearchParams()
  const claimedAmount = query.get('claimedAmount') || ''

  return (
    <MediumPaper>
      <SuccessfulClaim data={{ claimedAmount }} onNext={() => router.push(AppRoutes.governance)} />
    </MediumPaper>
  )
}

export default ClaimPage
