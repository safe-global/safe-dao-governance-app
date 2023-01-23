import { ClaimingWidget } from '@/components/DashboardWidgets/ClaimingWidget'
import { SnapshotWidget } from '@/components/DashboardWidgets/SnapshotWidget'
import type { ReactElement } from 'react'

import css from './styles.module.css'

export const DashboardWidgets = (): ReactElement => {
  return (
    <div className={css.wrapper}>
      <SnapshotWidget />
      <ClaimingWidget />
    </div>
  )
}
