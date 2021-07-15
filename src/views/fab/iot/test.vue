<template>
  <div class="app">
    <div id="kChart" />
    <div id="lineChart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { tempbytimes } from '@/api/public'
import request from '@/utils/request'

export default {
  components: {},
  data() {
    return {
      tempStart: [],
      tempEnd: [],
      tempMax: [],
      tempMin: [],
      tempStart2: [],
      tempEnd2: [],
      tempMax2: [],
      tempMin2: [],
      tempStart1: [],
      tempEnd1: [],
      tempMax1: [],
      tempMin1: [],
      time: [],
      color: ['#5470C6', '#91CC75', '#FCD887', '#EE6666']
    }
  },
  mounted() {
    tempbytimes('APJ-TRM1').then((res) => {
      res.data.results.forEach((item) => {
        if (item.periodDate === '2021-03-11') {
          this.tempStart.push(parseInt(item.tempStart))
          this.tempEnd.push(parseInt(item.tempEnd))
          this.tempMax.push(parseInt(item.tempMax))
          this.tempMin.push(parseInt(item.tempMin))
        } else if (item.periodDate === '2021-03-12') {
          this.tempStart2.push(parseInt(item.tempStart))
          this.tempEnd2.push(parseInt(item.tempEnd))
          this.tempMax2.push(parseInt(item.tempMax))
          this.tempMin2.push(parseInt(item.tempMin))
        }
      })
      // console.log(this.tempStart)
      this.kChart()
    })

    // tempbytime('APJ-TRM1', {
    //   beginTime: '2021-07-01',
    //   endTime: '2021-07-02'
    // }).then((res) => {
    //   console.log(res)
    // })
    // this.lChart()
  },
  methods: {
    kChart() {
      var chartDom = document.getElementById('kChart')
      var mycharts = echarts.init(chartDom)
      var option

      option = {
        legend: {
          data: ['temp_start', 'temp_end', 'temp_max', 'temp_min']
        },
        xAxis: {
          type: 'category',
          data: ['2021-03-11', '2021-03-12']
        },
        yAxis: {},
        series: [
          {
            name: 'temp_start',
            type: 'candlestick',
            data: [this.tempStart, this.tempMax2],
            itemStyle: {
              color: '#174BAD',
              color0: '#174BAD',
              borderColor: '#174BAD',
              borderColor0: '#174BAD'
            }
          },
          {
            name: 'temp_end',
            type: 'candlestick',
            data: [this.tempEnd, this.tempMax2],
            itemStyle: {
              color: '#23D454',
              color0: '#23D454',
              borderColor: '#23D454',
              borderColor0: '#23D454'
            }
          },
          {
            name: 'temp_max',
            type: 'candlestick',
            data: [this.tempMax, this.tempMax2],
            itemStyle: {
              color: '#E0DA1A',
              color0: '#E0DA1A',
              borderColor: '#E0DA1A',
              borderColor0: '#E0DA1A'
            }
          },
          {
            name: 'temp_min',
            type: 'candlestick',
            data: [this.tempMin, this.tempMin2],
            itemStyle: {
              color: '#E01A63',
              color0: '#E01A63',
              borderColor: '#E01A63',
              borderColor0: '#E01A63'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          // position: ['50%', '50%'],
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          },
          axisPointer: {
            type: 'cross'
          }
        }
      }
      mycharts.setOption(option)
      mycharts.on('click', (params) => {
        this.getLChartData(params.name)
      })
    },
    lChart() {
      var chartDom = document.getElementById('lineChart')
      var mycharts = echarts.init(chartDom)
      var option
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['temp_start', 'temp_end', 'temp_max', 'temp_min']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.time
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            // 曲线数据配置
            data: this.tempStart1,
            // 曲线名
            name: 'temp_start',
            // 设置参数对应的y坐标轴的索引
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.tempEnd1,
            // 曲线名
            name: 'temp_end',
            // 设置所在曲线对应的y坐标轴的索引
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.tempMax1,
            name: 'temp_max',
            // 设置参数对应的y坐标轴的索引
            type: 'line',
            // 曲线平滑设置
            smooth: true
          },
          {
            data: this.tempMin1,
            name: 'temp_min',
            // 设置参数对应的y坐标轴的索引
            type: 'line',
            // 曲线平滑设置
            smooth: true
          }
        ]
      }
      mycharts.setOption(option)
    },
    getLChartData(time) {
      return request(`oven/ovnbatchlotday/selectTime/${time}`)
        .then((res) => {
          res.data.results.forEach((item) => {
            this.time.push(item.createDate)
            this.tempStart1.push(parseInt(item.tempStart))
            this.tempEnd1.push(parseInt(item.tempEnd))
            this.tempMax1.push(parseInt(item.tempMax))
            this.tempMin1.push(parseInt(item.tempMin))
          })
        })
        .finally(() => {
          this.lChart()
        })
    }
  }
}
</script>

<style  scoped>
#kChart,
#lineChart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>
