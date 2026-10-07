import { EChartsOption } from 'echarts'
import * as echarts from 'echarts'

const { t } = useI18n()

/* 深色赛博图表配色 */
const cyberText = '#94a3b8'
const cyberTextStrong = '#e2e8f0'
const cyberAxisLine = 'rgba(0, 240, 255, 0.12)'
const cyberSplitLine = 'rgba(0, 240, 255, 0.08)'
const cyberTooltip = {
  backgroundColor: '#111827',
  borderColor: 'rgba(0, 240, 255, 0.2)',
  textStyle: { color: cyberTextStrong }
}
const cyberGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: '#00f0ff' },
  { offset: 1, color: '#7b2ff7' }
])
const cyberPieColors = ['#00f0ff', '#7b2ff7', '#3b82f6', '#10b981', '#f59e0b']

export const lineOptions: EChartsOption = {
  title: {
    text: t('analysis.monthlySales'),
    left: 'center',
    textStyle: { color: cyberTextStrong }
  },
  xAxis: {
    data: [
      t('analysis.january'),
      t('analysis.february'),
      t('analysis.march'),
      t('analysis.april'),
      t('analysis.may'),
      t('analysis.june'),
      t('analysis.july'),
      t('analysis.august'),
      t('analysis.september'),
      t('analysis.october'),
      t('analysis.november'),
      t('analysis.december')
    ],
    boundaryGap: false,
    axisTick: {
      show: false
    },
    axisLabel: { color: cyberText },
    axisLine: { lineStyle: { color: cyberAxisLine } }
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 20,
    top: 80,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    padding: [5, 10],
    ...cyberTooltip
  },
  yAxis: {
    axisTick: {
      show: false
    },
    axisLabel: { color: cyberText },
    axisLine: { lineStyle: { color: cyberAxisLine } },
    splitLine: { lineStyle: { color: cyberSplitLine } }
  },
  legend: {
    data: [t('analysis.estimate'), t('analysis.actual')],
    top: 50,
    textStyle: { color: cyberText }
  },
  series: [
    {
      name: t('analysis.estimate'),
      smooth: true,
      type: 'line',
      data: [100, 120, 161, 134, 105, 160, 165, 114, 163, 185, 118, 123],
      animationDuration: 2800,
      animationEasing: 'cubicInOut',
      itemStyle: { color: '#00f0ff' }
    },
    {
      name: t('analysis.actual'),
      smooth: true,
      type: 'line',
      itemStyle: { color: '#7b2ff7' },
      data: [120, 82, 91, 154, 162, 140, 145, 250, 134, 56, 99, 123],
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }
  ]
}

export const pieOptions: EChartsOption = {
  title: {
    text: t('analysis.userAccessSource'),
    left: 'center',
    textStyle: { color: cyberTextStrong }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
    ...cyberTooltip
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: { color: cyberText },
    data: [
      t('analysis.directAccess'),
      t('analysis.mailMarketing'),
      t('analysis.allianceAdvertising'),
      t('analysis.videoAdvertising'),
      t('analysis.searchEngines')
    ]
  },
  series: [
    {
      name: t('analysis.userAccessSource'),
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      color: cyberPieColors,
      data: [
        { value: 335, name: t('analysis.directAccess') },
        { value: 310, name: t('analysis.mailMarketing') },
        { value: 234, name: t('analysis.allianceAdvertising') },
        { value: 135, name: t('analysis.videoAdvertising') },
        { value: 1548, name: t('analysis.searchEngines') }
      ]
    }
  ]
}

export const barOptions: EChartsOption = {
  title: {
    text: t('analysis.weeklyUserActivity'),
    left: 'center',
    textStyle: { color: cyberTextStrong }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    ...cyberTooltip
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 20
  },
  xAxis: {
    type: 'category',
    data: [
      t('analysis.monday'),
      t('analysis.tuesday'),
      t('analysis.wednesday'),
      t('analysis.thursday'),
      t('analysis.friday'),
      t('analysis.saturday'),
      t('analysis.sunday')
    ],
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: { color: cyberText },
    axisLine: { lineStyle: { color: cyberAxisLine } }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: cyberText },
    axisLine: { lineStyle: { color: cyberAxisLine } },
    splitLine: { lineStyle: { color: cyberSplitLine } }
  },
  series: [
    {
      name: t('analysis.activeQuantity'),
      data: [13253, 34235, 26321, 12340, 24643, 1322, 1324],
      type: 'bar',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: cyberGradient
      }
    }
  ]
}

export const radarOption: EChartsOption = {
  legend: {
    data: [t('workplace.personal'), t('workplace.team')],
    textStyle: { color: cyberText }
  },
  radar: {
    // shape: 'circle',
    axisName: { color: cyberText },
    splitLine: { lineStyle: { color: cyberSplitLine } },
    splitArea: { areaStyle: { color: ['rgba(0, 240, 255, 0.02)', 'rgba(123, 47, 247, 0.04)'] } },
    axisLine: { lineStyle: { color: cyberAxisLine } },
    indicator: [
      { name: t('workplace.quote'), max: 65 },
      { name: t('workplace.contribution'), max: 160 },
      { name: t('workplace.hot'), max: 300 },
      { name: t('workplace.yield'), max: 130 },
      { name: t('workplace.follow'), max: 100 }
    ]
  },
  series: [
    {
      name: `xxx${t('workplace.index')}`,
      type: 'radar',
      data: [
        {
          value: [42, 30, 20, 35, 80],
          name: t('workplace.personal')
        },
        {
          value: [50, 140, 290, 100, 90],
          name: t('workplace.team')
        }
      ]
    }
  ]
}

export const wordOptions = {
  series: [
    {
      type: 'wordCloud',
      gridSize: 2,
      sizeRange: [12, 50],
      rotationRange: [-90, 90],
      shape: 'pentagon',
      width: 600,
      height: 400,
      drawOutOfBound: true,
      textStyle: {
        color: function () {
          return (
            'rgb(' +
            [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') +
            ')'
          )
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: [
        {
          name: 'Sam S Club',
          value: 10000,
          textStyle: {
            color: 'black'
          },
          emphasis: {
            textStyle: {
              color: 'red'
            }
          }
        },
        {
          name: 'Macys',
          value: 6181
        },
        {
          name: 'Amy Schumer',
          value: 4386
        },
        {
          name: 'Jurassic World',
          value: 4055
        },
        {
          name: 'Charter Communications',
          value: 2467
        },
        {
          name: 'Chick Fil A',
          value: 2244
        },
        {
          name: 'Planet Fitness',
          value: 1898
        },
        {
          name: 'Pitch Perfect',
          value: 1484
        },
        {
          name: 'Express',
          value: 1112
        },
        {
          name: 'Home',
          value: 965
        },
        {
          name: 'Johnny Depp',
          value: 847
        },
        {
          name: 'Lena Dunham',
          value: 582
        },
        {
          name: 'Lewis Hamilton',
          value: 555
        },
        {
          name: 'KXAN',
          value: 550
        },
        {
          name: 'Mary Ellen Mark',
          value: 462
        },
        {
          name: 'Farrah Abraham',
          value: 366
        },
        {
          name: 'Rita Ora',
          value: 360
        },
        {
          name: 'Serena Williams',
          value: 282
        },
        {
          name: 'NCAA baseball tournament',
          value: 273
        },
        {
          name: 'Point Break',
          value: 265
        }
      ]
    }
  ]
}
