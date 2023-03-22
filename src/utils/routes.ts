import { AppRoutes } from '@/config/routes'

export const isDashboard = (path: string) => {
  return path === AppRoutes.widgets
}
