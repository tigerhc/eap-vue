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
      let a = 0
      let b = 0
      let c = 0
      let d = 0
      let e = 0
      let f = 0
      let g = 0
      let h = 0
      res.data.results.forEach((item) => {
        if (item.periodDate === '2021-03-11') {
          a = parseInt(item.tempStart)
          b = parseInt(item.tempEnd)
          c = parseInt(item.tempMax)
          d = parseInt(item.tempMin)
        } else if (item.periodDate === '2021-03-12') {
          e = parseInt(item.tempStart)
          f = parseInt(item.tempEnd)
          g = parseInt(item.tempMax)
          h = parseInt(item.tempMin)
        }
      })
      this.tempStart = [a, b, c, d]
      this.tempStart2 = [e, f, g, h]
      console.log(this.tempStart)
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
            type: 'candlestick',
            data: [this.tempStart, this.tempStart2]
          }
        ],
        tooltip: {
          trigger: 'axis',
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
          const time = []
          const arr1 = []
          const arr2 = []
          const arr3 = []
          const arr4 = []
          res.data.results.forEach((item) => {
            time.push(item.createDate)
            arr1.push(parseInt(item.tempStart))
            arr2.push(parseInt(item.tempEnd))
            arr3.push(parseInt(item.tempMax))
            this.tempMin1.push(parseInt(item.tempMin))
          })
          this.time = time
          this.tempStart1 = arr1
          this.tempEnd1 = arr2
          this.tempMax1 = arr3
          this.tempMin1 = arr4
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
