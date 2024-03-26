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
}

export const RoutesWithNavigation = [AppRoutes.activity, AppRoutes.index]
