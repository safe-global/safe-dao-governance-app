import { useTheme } from '@mui/material/styles'
import { VictoryThemeDefinition } from 'victory'

const colors = ['#DDDEE0', '#525252', '#737373', '#969696', '#bdbdbd', '#d9d9d9', '#f0f0f0']
const grey = '#A1A3A7'

// Typography
const sansSerif = "'DM Sans'"
const letterSpacing = 'normal'
const fontSize = '14px'

// Layout
const baseProps = {
  width: 500,
  height: 318,
  padding: 24,
  colorScale: colors,
}

// Strokes
const strokeLinecap = 'round'
const strokeLinejoin = 'round'

// Put it all together...
export const useVictoryTheme = (): VictoryThemeDefinition => {
  const muiTheme = useTheme()
  const fontColor = muiTheme.palette.text.secondary

  // Labels
  const baseLabelStyles = {
    fontFamily: sansSerif,
    fontSize,
    letterSpacing,
    padding: 8,
    fill: fontColor,
    stroke: 'transparent',
  }

  const centeredLabelStyles = Object.assign({ textAnchor: 'middle' }, baseLabelStyles)

  return {
    area: Object.assign(
      {
        style: {
          data: {
            fill: fontColor,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    axis: Object.assign(
      {
        style: {
          axis: {
            fill: 'transparent',
            stroke: fontColor,
            strokeWidth: 1,
            strokeLinecap,
            strokeLinejoin,
          },
          axisLabel: Object.assign({}, centeredLabelStyles, {
            padding: 16,
          }),
          grid: {
            fill: 'none',
            stroke: 'none',
          },
          ticks: {
            fill: 'transparent',
            size: 1,
            stroke: 'transparent',
          },
          tickLabels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    chart: baseProps,
    errorbar: Object.assign(
      {
        borderWidth: 8,
        style: {
          data: {
            fill: 'transparent',
            stroke: fontColor,
            strokeWidth: 2,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    group: Object.assign(
      {
        colorScale: colors,
      },
      baseProps,
    ),
    histogram: Object.assign(
      {
        style: {
          data: {
            fill: grey,
            stroke: fontColor,
            strokeWidth: 2,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    legend: {
      colorScale: colors,
      gutter: 10,
      orientation: 'vertical',
      titleOrientation: 'top',
      style: {
        data: {
          type: 'circle',
        },
        labels: baseLabelStyles,
        title: Object.assign({}, baseLabelStyles, { padding: 5 }),
      },
    },
    line: Object.assign(
      {
        style: {
          data: {
            fill: 'transparent',
            stroke: fontColor,
            strokeWidth: 2,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    scatter: Object.assign(
      {
        style: {
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    pie: {
      style: {
        data: {
          padding: 10,
          stroke: 'transparent',
          strokeWidth: 1,
        },
        labels: Object.assign({}, baseLabelStyles, { padding: 20 }),
      },
      colorScale: colors,
      width: 400,
      height: 400,
      padding: 50,
    },
    tooltip: {
      style: Object.assign({}, baseLabelStyles, { padding: 0, pointerEvents: 'none' }),
      flyoutStyle: {
        stroke: fontColor,
        strokeWidth: 1,
        fill: '#f0f0f0',
        pointerEvents: 'none',
      },
      flyoutPadding: 5,
      cornerRadius: 5,
      pointerLength: 10,
    },
    voronoi: Object.assign(
      {
        style: {
          data: {
            fill: 'transparent',
            stroke: 'transparent',
            strokeWidth: 0,
          },
          labels: Object.assign({}, baseLabelStyles, { padding: 5, pointerEvents: 'none' }),
          flyout: {
            stroke: fontColor,
            strokeWidth: 1,
            fill: '#f0f0f0',
            pointerEvents: 'none',
          },
        },
      },
      baseProps,
    ),
  }
}
