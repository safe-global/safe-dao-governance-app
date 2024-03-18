import { useTheme } from '@mui/material/styles'

/**
 * Renders svg gradient definitions.
 */
export const BoostGradients = () => {
  const theme = useTheme()
  return (
    <svg width={0} height={0}>
      <defs>
        <linearGradient id="gradient" x1="1" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.primary.main}>
            <animate
              attributeName="stop-color"
              values={`${theme.palette.primary.main}; ${theme.palette.info.main}; ${theme.palette.primary.main};`}
              dur="6s"
              repeatCount="indefinite"
              keySplines="
                0.1 0.8 0.2 1;
                0.1 0.8 0.2 1;"
              calcMode="spline"
            />
          </stop>
          <stop offset="100%" stop-color={theme.palette.info.main}>
            <animate
              attributeName="stop-color"
              values={`${theme.palette.info.main};${theme.palette.primary.main}; ${theme.palette.info.main};`}
              dur="6s"
              repeatCount="indefinite"
              keySplines="
                0.1 0.8 0.2 1;
                0.1 0.8 0.2 1;"
              calcMode="spline"
            />
          </stop>
        </linearGradient>
        <linearGradient id="loss" x1="1" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.warning.dark}></stop>
          <stop offset="50%" stop-color="rgba(0,0,0, 0)" />
        </linearGradient>
        <linearGradient id="gain" x1="0" x2="0.5" y1="0" y2="1">
          <stop offset="0%" stop-color={theme.palette.primary.main}></stop>
          <stop offset="100%" stop-color="rgba(0,0,0, 0)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
