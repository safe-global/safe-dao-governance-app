import App from 'next/app'

export const AppRoutes = {
  '404': '/404',
  widgets: '/widgets',
  safedao: '/safedao',
  index: '/',
  delegate: '/delegate',
  claim: '/claim',
  activity: '/activity',
  governance: '/governance',
  unlock: '/unlock',
  terms: '/terms',
  splash: '/splash',
}

export const RoutesWithNavigation = [AppRoutes.activity, AppRoutes.governance]

export const RoutesRequiringWallet = [AppRoutes.activity, AppRoutes.claim, AppRoutes.unlock, AppRoutes.index]
