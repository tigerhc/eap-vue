
<template>
    <div class="condition-panel">
      <el-form class="form" label-width="90px" size="small">
        <el-row :gutter="10">
          <el-col :span="4" >
            <el-form-item label="类型:">
              <el-select v-model="form1.type" class="wid90" @change="findProduction">
                <el-option v-for="item in TypeResult" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="4">
          <el-form-item label="机种名:">
            <div class="condition">
              <el-select v-model="form.productionName" class="wid90" >
                <el-option
                  v-for="item in productionResult"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
          <el-col :span="4">
          <el-form-item label="串行计数器:">
            <el-select v-model="form.number" class="wid90" >
              <el-option v-for="item in lineTypeResult" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          </el-col>
        <el-col :span="4">
          <el-form-item label="日期:">
            <el-date-picker v-model="dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="dateTimeClass"/>
          </el-form-item>
        </el-col>
          <el-col :span="4" :offset="-1">
          <el-form-item >
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div id="main" style="width: 80%;height: 500px;overflow: hidden;"/>
    </div>
</template>
<script>
import echarts from 'echarts'
import { productionName } from '@/api/oven/temperature'
// import { findSxNumber } from '@/api/public'
// import {
//   TitleComponent,
//   ToolboxComponent,
//   TooltipComponent,
//   GridComponent,
//   LegendComponent
// } from 'echarts/components'
// import {
//   LineChart
// } from 'echarts/charts'
// import {
//   CanvasRenderer
// } from 'echarts/renderers'
//
// echarts.use(
//   [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]
// )
import { findSxNumber } from '@/api/ms/monitor'
export default {
  name: 'Index',
  data() {
    return {
      form: {
        number: '',
        type: '',
        productionName: '',
        startDate: '',
        endDate: ''
      },
      form1: {
        type: ''
      },
      myChart: null,
      dateTime: [],
      series: [],
      data: [],
      productionResult: [],
      type: '',
      lineTypeResult: [{
        value: '0001',
        label: '1'
      }, {
        value: '0002',
        label: '2'
      }],
      TypeResult: [{
        value: 'LF',
        label: 'LF'
      }, {
        value: 'check',
        label: '检查'
      }]
    }
  },
  methods: {
    findProduction() {
      productionName(this.form1).then((response) => {
        this.productionResult = response.data
      })
    },
    search() {
      this.form.type = this.form1.type
      this.form.startDate = this.dateTime[0]
      this.form.endDate = this.dateTime[1]
      findSxNumber(this.form).then(res => {
        this.data = res.data[0]
        this.series = res.data[1]
        this.initChart()
      })
    },
    initChart() {
      if (this.myChart != null) {
        this.myChart.dispose()
      }
      var chartDom = document.getElementById('main')
      this.myChart = echarts.init(chartDom)
      // var app = {};
      var option
      option = {
        color: ['#3CB371', '#7B68EE', '#DA70D6', '#5F9EA0', '#FF0000', '#FFA500', '#800000', '#1E90FF'],
        title: {
          text: '量测分离倾向管理图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['1:A', '1:B', '1:C', '1:D', '2:A', '2:B', '3:C', '4:D']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data
          // data: ['周一', '周二', '周二', '周二', '周二', '周二', '周二']
        },
        yAxis: {
          type: 'value'
        },
        series: this.series
        // series: [
        //   {
        //     name: '邮件营销',
        //     type: 'line',
        //     stack: '总量',
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: '联盟广告',
        //     type: 'line',
        //     stack: '总量',
        //     data: [220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name: '视频广告',
        //     type: 'line',
        //     stack: '总量',
        //     data: [150, 232, 201, 154, 190, 330, 410]
        //   },
        //   {
        //     name: '直接访问',
        //     type: 'line',
        //     stack: '总量',
        //     data: [320, 332, 301, 334, 390, 330, 320]
        //   },
        //   {
        //     name: '搜索引擎',
        //     type: 'line',
        //     stack: '总量',
        //     data: [820, 932, 901, 934, 1290, 1330, 1320]
        //   }
        // ]
      }
      this.myChart.setOption(option)
      // if (option && typeof option === 'object') {
      //   myChart.setOption(option)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  .condition-panel {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  .form {
    margin-top: 20px;
  }
  }
</style>
