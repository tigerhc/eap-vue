
<template>
  <div class="app-container calendar-list-container">
    <div class="condition-panel">
      <el-form class="form" label-width="90px" size="small">
        <el-row>
          <el-col :span="4" >
            <el-form-item label="类型:">
              <el-select v-model="form1.type" class="wid90" @change="findProduction">
                <el-option v-for="item in TypeResult" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="4" >
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
            <el-form-item label="位置:">
            <el-select v-model="form.local" class="wid90" @change="search">
              <el-option
                v-for="item in localResult"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="4" >
          <el-form-item label="日期:">
            <el-date-picker v-model="dateTime" style="width: 130%" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="dateTimeClass"/>
          </el-form-item>
        </el-col>
          <el-button type="primary" style="height: 32px ;margin-left: 70px" @click="search">查询</el-button>
        </el-row>
      </el-form>
    </div>
      <div class="frame">
        <div id="main" style="width: 70%;height: 500px;overflow: hidden;"/>
        <img id="mainImg" :src="picUrl" class="arrow_box">
      </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import { productionName } from '@/api/oven/temperature'
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
        endDate: '',
        local: ''
      },
      form1: {
        type: ''
      },
      myChart: null,
      dateTime: [],
      series: [],
      data: [],
      min: undefined,
      productionResult: [],
      type: '',
      picUrl: undefined,
      picUrlA: require('../../../assets/img/sxA.png'),
      picUrlB: require('../../../assets/img/sxB.png'),
      picUrlC: require('../../../assets/img/sxC.png'),
      picUrlD: require('../../../assets/img/sxD.png'),
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
      }],
      localResult: [{
        value: 'a',
        label: 'A'
      }, {
        value: 'b',
        label: 'B'
      }, {
        value: 'c',
        label: 'C'
      }, {
        value: 'd',
        label: 'D'
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
      if (this.form.local === 'a') {
        this.picUrl = this.picUrlA
      } else if (this.form.local === 'b') {
        this.picUrl = this.picUrlB
      } else if (this.form.local === 'c') {
        this.picUrl = this.picUrlC
      } else if (this.form.local === 'd') {
        this.picUrl = this.picUrlD
      }
      this.form.number = '0001'
      this.form.type = this.form1.type
      this.form.startDate = this.dateTime[0]
      this.form.endDate = this.dateTime[1]
      findSxNumber(this.form).then(res => {
        this.data = res.data[0]
        this.series = res.data[1]
        this.min = res.data[2].min
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
        color: ['#3CB371', '#00FFFF', '#FF0000', '#FF0000', '#1E90FF', '#FFA500', '#800000', '#1E90FF'],
        title: {
          text: '量测分离倾向管理图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['1-1:A', '1-2:A', '2-1:A', '2-2:A', '1-1:B', '1-2:B', '2-1:B', '2-2:B', '上限', '下限', '1-1:C', '1-2:C', '2-1:C', '2-2:C', '1-1:D', '1-2:D', '2-1:D', '2-2:D', '上限', '下限']
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
          type: 'value',
          min: this.min
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
  @import "src/styles/proindex";
  .Rtplotyieldday {
    width: auto;
    height: auto;
    margin: 0 auto;

    .form {
      margin-top: 20px;
    }
    .condition{
      box-sizing: border-box;
      display: inline-block;
      font-family: sans-serif;
      margin: 0;
    }
  }
</style>
