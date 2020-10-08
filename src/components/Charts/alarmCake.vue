<template>
  <div :id="id" class="alarmCake" />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    list: {
      type: Array
    },
    id: {
      type: String,
      default: 'chart'
    },
    beginTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      scatterData: [],
      myChart: null
      // beginTime:'2017-02-10',
      // endTime:'2017-03-10'
    }
  },
  watch: {
    list() {
      this.myChart.dispose()
      this.scatterData = this.getVirtulData()
      this.myChart = echarts.init(document.getElementById(this.id))
      this.initChart()
      const that = this
      setTimeout(function() {
        that.myChart.setOption({
          series: that.getPieSeries(that.scatterData, that.myChart)
        })
      }, 10)
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.scatterData = this.getVirtulData()
    this.myChart = echarts.init(document.getElementById(this.id))
    this.initChart()
    const that = this
    setTimeout(function() {
      that.myChart.setOption({
        series: that.getPieSeries(that.scatterData, that.myChart)
      })
    }, 10)

    // app.onresize = function() {
    //   if (pieInitialized) {
    //     that.myChart.setOption({
    //       series: that.getPieSeriesUpdate(that.scatterData, that.myChart)
    //     })
    //   }
    // }
  },
  beforeDestroy() {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  },
  methods: {
    initChart() {
      var cellSize = [100, 100]
      this.myChart.setOption({
        tooltip: {},
        legend: {
          data: ['RUN', 'IDLE', 'DOWN', 'OTHER'],
          bottom: 20,
          right: 0
        },
        calendar: {
          top: 'middle',
          left: 'center',
          orient: 'vertical',
          cellSize: cellSize,
          yearLabel: {
            show: true,
            padding: [10, 0, 10, 0],
            textStyle: {
              fontSize: 30
            }
          },
          dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          },
          monthLabel: {
            show: true
          },
          range: [this.beginTime, this.endTime]
        },
        series: [
          {
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return echarts.format.formatTime('dd', params.value[0])
                },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                textStyle: {
                  color: '#000',
                  fontSize: 14
                }
              }
            },
            data: this.scatterData
          }
        ]
      })
    },
    getVirtulData() {
      var data = []
      for (const item of this.list) {
        data.push([item.periodDate, item.runTime, item.idleTime, item.downTime, item.otherTime])
      }
      return data
    },
    getPieSeries(scatterData, chart) {
      return echarts.util.map(scatterData, function(item, index) {
        var center = chart.convertToPixel('calendar', item)
        return {
          id: index + 'pie',
          type: 'pie',
          center: center,
          label: {
            normal: {
              formatter: '{c}',
              position: 'inside'
            }
          },
          radius: 40,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            color: function(params) {
              var colorList = ['#43ca17', '#FFFF00', '#FF0000', '#808080']
              return colorList[params.dataIndex]
            }

          },
          data: [
            { name: 'RUN', value: item[1] },
            { name: 'IDLE', value: item[2] },
            { name: 'DOWN', value: item[3] },
            { name: 'OTHER', value: item[4] }
          ]
        }
      })
    },
    getPieSeriesUpdate(scatterData, chart) {
      return echarts.util.map(scatterData, function(item, index) {
        var center = chart.convertToPixel('calendar', item)
        return {
          id: index + 'pie',
          center: center
        }
      })
    }
  }
}
</script>
<style scoped>
.alarmCake {
  width: 800px;
  height: 600px;
  overflow: hidden;
}
</style>
