<template>
  <div class="app-container calendar-list-container">
    <el-form class="form" label-width="90px" size="small">
      <el-row>
        <el-col :span="2">
          <el-form-item>
            <el-select :style="{width:'80px'}" v-model="form.lineNo" placeholder="线别" @change="lineChange">
              <el-option v-for="item in lines" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
              <el-select v-model="form.eqpId" clearable placeholder="机种名">
                <el-option v-for="item in thrustEqpId" :key="item" :label="item" :value="item" />
              </el-select>
            <input v-model="form.lotNo" :style="{width:'80px',height:'32px',marginLeft:'20px'}" type="text" placeholder="批量号" class="el-input__inner">
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="dateTime">
            <el-date-picker
              v-model="form.dateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="finddetail">导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="editableTabsValue" type="card" >
      <el-tab-pane v-for="item in editableTabs" :key="item.title" :label="item.title" :name="item.title" />
    </el-tabs>
    <div class="eqpTemp">
      <div id="XtempChart" style="width: 100%; height: 280px; overflow: hidden" />
    </div>
    <div class="eqpTemp">
      <div id="RtempChart" style="width: 100%; height: 280px; overflow: hidden; margin-top:100px" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import api from '../../oven/ports/fetch'
import { findThrustEqps, findThrustData } from '@/api/ms/monitor'
export default {
  name: 'Tempchar',
  data() {
    return {
      lines: ['5GI', '6GI'],
      thrustEqpId: [],
      api: api('/ms/msmeasurethrust/exportLogThrust'),
      toolbarStatus: {
        exportsLoading: false
      },
      form: {
        lineNo: '',
        eqpId: undefined,
        dateTime: [],
        lotNo: ''
      },
      editableTabsValue: '拉力',
      editableTabs: [{ 'index': 0, 'title': '拉力' }, { 'index': 1, 'title': '推力' }],
      echartData: [],
      echartAxis: [],
      echartCL: [],
      echartUCL: [],
      echartLCL: [],
      echartRed: [],
      XData: [],
      RData: []
    }
  },
  mounted() {
    var now = new Date()
    var endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
    var startDate = endDate.slice(0, 8) + '01'
    this.form.dateTime = [startDate, endDate]
  },
  created() {
    // eqpList().then((response) => {
    //   this.tempEqpId = response.data.eqpId
    // })
  },
  methods: {
    lineChange() {
      var param = {}
      param.lineNo = this.form.lineNo
      findThrustEqps(param).then((res) => {
        this.thrustEqpId = res.data.productionNameList
      })
    },
    onValueChange(name) {
      this.form.eqpId = name
    },
    search() {
      var param = {}
      param.productionName = this.form.eqpId
      param.startTime = this.form.dateTime[0] + ' 00:00:00'
      param.endTime = this.form.dateTime[1] + ' 23:59:59'
      param.lotNo = this.form.lotNo
      if (this.editableTabsValue === '推力') {
        param.type = 'pull'
      } else {
        param.type = 'thrust'
      }
      findThrustData(param).then((res) => {
        this.echartAxis = res.data.xAxis
        this.XData = res.data.XData
        this.RData = res.data.RData

        var chartX = echarts.init(document.getElementById('XtempChart'))
        chartX.setOption(this.getOption('X'))
        var chartR = echarts.init(document.getElementById('RtempChart'))
        chartR.setOption(this.getOption('R'))
      })
    },
    getOption(XRflag) {
      const Cureoption = {
        title: { text: '' },
        color: ['#60c947', '#efbe29', '#efbe29', '#ee1313'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' }}
        },
        legend: {
          data: this.charLegend,
          // data: ['运行温度', '低温报警', '高温报警']
          textStyle: {
            fontSize: 15, // 设置legend字体大小 表格名称下一行
            color: '#000000'
          }
        },
        dataZoom: [
          { type: 'inside', start: 0, end: 100 },
          { show: true, type: 'slider', y: '90%', start: 0, end: 100 }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: { yAxisIndex: 'none' },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: false },
          data: this.echartAxis
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            // 内容格式器  保留2位小数
            // formatter: function(value, index) {
            //   return value.toFixed(2)
            // },
            splitArea: { show: true },
            textStyle: {
              color: '#',
              fontSize: 15,
              fontWeight: 800
            }
          }
        }
      }
      if (XRflag === 'X') {
        Cureoption.title.text = 'X管理图(单位:gf)'
        Cureoption.series = this.getXseries()
      } else if (XRflag === 'R') {
        Cureoption.title.text = 'R管理图(单位:gf)'
        Cureoption.series = this.getRseries()
      }
      return Cureoption
    },
    getXseries() {
      var series = [
        {
          name: '实测值',
          itemStyle: { normal: { color: '#1a3eef' }},
          type: 'line',
          data: this.XData,
          symbol: 'diamond',
          symbolSize: 20
        },
        {
          name: 'X CL',
          itemStyle: { normal: { lineStyle: { color: '#60c947', width: 2 }}},
          type: 'line',
          data: this.echartCL,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        },
        {
          name: 'X UCL',
          itemStyle: { normal: { lineStyle: { color: '#efbe29', width: 2 }}},
          type: 'line',
          data: this.echartUCL,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        },
        {
          name: 'X LCL',
          itemStyle: { normal: { lineStyle: { color: '#efbe29', width: 2 }}},
          type: 'line',
          data: this.echartLCL,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        },
        {
          name: 'LCL',
          itemStyle: { normal: { lineStyle: { color: '#ee1313', width: 2, type: 'dashed' }}},
          type: 'line',
          data: this.echartRed,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        }
      ]
      return series
    },
    getRseries() {
      var series = [
        {
          name: '偏差值',
          itemStyle: { normal: { color: '#1a3eef', lineStyle: { color: '#1a3eef', width: 3 }}},
          type: 'line',
          data: this.RData,
          symbol: 'diamond',
          symbolSize: 20
        },
        {
          name: 'R CL',
          itemStyle: { normal: { lineStyle: { color: '#60c947', width: 2 }}},
          type: 'line',
          data: this.echartCL,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        },
        {
          name: 'R UCL',
          itemStyle: { normal: { lineStyle: { color: '#efbe29', width: 2 }}},
          type: 'line',
          data: this.echartUCL,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        },
        {
          name: 'R LCL',
          itemStyle: { normal: { lineStyle: { color: '#efbe29', width: 2 }}},
          type: 'line',
          data: this.echartLCL,
          markLine: { data: [{ name: '最大数据', type: 'max' }] }
        }
      ]
      return series
    },
    finddetail() {
      // var param = this.$refs.ref.fdis()
      // this.query.id = param
      // eslint-disable-next-line no-undef
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      // const q = (this.query)
      // const q = this.form
      var param = {}
      param.productionName = this.form.eqpId
      param.startTime = this.form.dateTime[0] + ' 00:00:00'
      param.endTime = this.form.dateTime[1] + ' 23:59:59'
      param.lotNo = this.form.lotNo
      if (param.productionName === '' || (param.lotNo === '' && param.startTime === '')) {
        alert('请选择机种名和时间段')
        return
      }
      this.api.export(param).then((response) => {
        if (response.code === 0) {
          return import('../../oven/ports/Export2Excel').then((excel) => {
            excel.export_byte_to_excel(response.bytes, response.title)
            this.toolbarStatus.exportsLoading = false
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: (response && response.errmsg) || '导出失败!',
            duration: 2000
          })
          this.toolbarStatus.exportsLoading = false
        }
      }).catch((e) => {
        this.toolbarStatus.exportsLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .tempchar {
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .form {
      margin-top: 20px;
    }
  }
  #chartPanelLeft {float: left; width: 40%; height: 100%; margin-left: 0px;}
  #chartPanelRight { float: left; width: 40%; height: 100%; }
  img { width: 100%; height: 100%; border: 1px solid red;}
</style>
