<template>
  <div class="app">
    <div id="kChart" />
    <div id="lineChart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import { tempbytime } from '@/api/public'
// import request from '@/utils/request'

export default {
  components: {},
  data() {
    return {
      tempsValue: [],
      lineChart: [],
      time: [],
      form: {
        eqpId: undefined,
        dateTime: []
      }
    }
  },
  mounted() {
    // tempbytime('APJ-TRM1', {
    //   beginTime: '2021-07-01',
    //   endTime: '2021-07-12'
    // }).then((res) => {
    //   this.tempsValue = res.data.results
    //   this.kChart()
    // })
    // this.lChart()
  },
  methods: {
    kChart() {
      var chartDom = document.getElementById('kChart')
      var mycharts = echarts.init(chartDom)
      var option

      option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,

          data: []
        },
        yAxis: {},
        series: [
          {
            type: 'k',
            data: ['other_temps_value']
          }
        ]
      }
      mycharts.setOption(this.loadOption(option), true)
      mycharts.on('click', (params) => {
        this.lineChart = params.data.slice(1)
        this.time.push(params.name)
        this.lChart(this.lineChart, this.time)
      })
    },
    lChart(data, time) {
      var chartDom = document.getElementById('lineChart')
      var mycharts = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8']
        },
        yAxis: {
          type: 'value'
        },
        // dataZoom: [
        //   {
        //     type: 'inside',
        //     start: 0,
        //     end: 20
        //   },
        //   {
        //     start: 0,
        //     end: 20
        //   }
        // ],
        series: [
          {
            data: data,
            type: 'line'
          }
        ]
      }
      mycharts.setOption(option)
    },
    produce(data, name) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        result.push(data[i][name])
      }
      return result
    },
    loadOption(option) {
      option.xAxis.data = this.produce(this.tempsValue, 'create_date')
      option.series[0].data = this.produce(this.tempsValue, 'other_temps_value')
      var limitMax = this.limitMax[this.form.eqpId][0]
      var limitMin = this.limitMin[this.form.eqpId][0]
      var myYAxis = this.getYAxis(option.series[0].data, limitMax, limitMin)
      option.yAxis = myYAxis
      return option
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
