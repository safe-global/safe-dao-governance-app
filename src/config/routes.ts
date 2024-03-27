import App from 'next/app'

export const AppRoutes = {
  '404': '/404',
  widgets: '/widgets',
  safedao: '/safedao',
  index: '/',
  delegate: '/delegate',
  claim: '/claim',
  activity: '/activity',
  unlock: '/unlock',
  terms: '/terms',
  connect: '/connect',
}

export const RoutesWithNavigation = [AppRoutes.activity, AppRoutes.index]

export const RoutesRequiringWallet = [AppRoutes.activity, AppRoutes.claim, AppRoutes.unlock, AppRoutes.index]
